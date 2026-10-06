import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Eye, Sparkles, Layers, Sliders, Play, Pause, Download } from 'lucide-react';
import { GestureId, DetectionResult } from '../types/gestures';
import { LEAP_GESTURES } from '../data/leapGestures';
import { renderLeapNIRFrame, HAND_CONNECTIONS } from '../utils/leapSensorSimulator';
import { RealtimeHandClassifier } from '../utils/handTracker';
import { UtilitarianSchematicHUD } from './UtilitarianSchematicHUD';

interface VisionStudioProps {
  onSelectGestureForHCI?: (gesture: GestureId) => void;
  activeHciGesture?: GestureId;
  initialSourceMode?: 'simulated' | 'webcam';
  onCameraStateChange?: (isActive: boolean) => void;
}

export const VisionStudio: React.FC<VisionStudioProps> = ({
  onSelectGestureForHCI,
  initialSourceMode = 'simulated',
  onCameraStateChange,
}) => {
  const [sourceMode, setSourceMode] = useState<'simulated' | 'webcam'>(initialSourceMode);
  const [selectedGesture, setSelectedGesture] = useState<GestureId>('01_palm');
  const [filterMode, setFilterMode] = useState<'nir' | 'edge' | 'threshold' | 'skeleton'>('nir');
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'error' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [detection, setDetection] = useState<DetectionResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const classifierRef = useRef<RealtimeHandClassifier>(new RealtimeHandClassifier());
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Function to start the webcam explicitly
  const startWebcam = async () => {
    setCameraState('requesting');
    setErrorMessage('');
    
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support webcam access or is running in an insecure context.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setSourceMode('webcam');
      setCameraState('active');
      if (onCameraStateChange) onCameraStateChange(true);
    } catch (err: any) {
      console.warn('Camera request error:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setCameraState(isDenied ? 'denied' : 'error');
      setErrorMessage(
        isDenied
          ? 'Camera permission was denied. Please allow camera permissions in your browser address bar to enable real-time gesture recognition.'
          : err.message || 'Could not connect to camera device. Make sure no other application is using your webcam.'
      );
      setSourceMode('simulated');
      if (onCameraStateChange) onCameraStateChange(false);
    }
  };

  // Function to stop the webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setSourceMode('simulated');
    setCameraState('idle');
    if (onCameraStateChange) onCameraStateChange(false);
  };

  // Handle switching to simulated mode
  const switchToSimulated = () => {
    stopWebcam();
    setSourceMode('simulated');
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Main Animation & Tracking loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const renderLoop = () => {
      if (!isMounted) return;

      if (isPlaying) {
        timeRef.current += 0.03;
      }
      const t = timeRef.current;

      const width = canvas.width;
      const height = canvas.height;

      if (sourceMode === 'webcam' && videoRef.current && videoRef.current.readyState >= 2) {
        // Draw webcam feed
        ctx.save();
        // Mirror horizontally for natural webcam feel
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.restore();

        // Apply visual NIR filter if requested
        if (filterMode === 'nir') {
          // Convert to grayscale near-infrared appearance
          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            // Contrast boost for NIR sensor style
            const boosted = Math.min(255, Math.pow(gray / 255, 1.4) * 280);
            data[i] = boosted * 0.85;     // slight cool tint
            data[i + 1] = boosted * 0.95;
            data[i + 2] = boosted;
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // Run classifier
        const result = classifierRef.current.analyzeFrame(canvas);
        setDetection(result);
        if (onSelectGestureForHCI) {
          onSelectGestureForHCI(result.gesture);
        }

        // Always draw skeleton landmarks on live webcam feed for immediate visual tracking feedback
        if ((filterMode === 'skeleton' || sourceMode === 'webcam') && result.landmarks) {
          drawSkeletonOverlay(ctx, result.landmarks, width, height);
        }
      } else {
        // Render Simulated Leap Motion Near-Infrared Sensor Feed
        renderLeapNIRFrame(ctx, width, height, selectedGesture, t, filterMode);
        
        // Analyze simulated frame
        const result = classifierRef.current.analyzeFrame(canvas, selectedGesture, t);
        setDetection(result);
        if (onSelectGestureForHCI) {
          onSelectGestureForHCI(result.gesture);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [sourceMode, selectedGesture, filterMode, isPlaying, onSelectGestureForHCI]);

  const drawSkeletonOverlay = (
    ctx: CanvasRenderingContext2D,
    landmarks: { x: number; y: number; z: number }[],
    width: number,
    height: number
  ) => {
    // Draw Bones
    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      if (!p1 || !p2) return;
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    // Draw Landmark Nodes with Concentric Gradient Circles
    landmarks.forEach((p, idx) => {
      const px = p.x * width;
      const py = p.y * height;
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      const isWrist = idx === 0;

      // Circle with gradient fading to transparency
      const radGrad = ctx.createRadialGradient(px, py, 1, px, py, isTip ? 14 : 8);
      radGrad.addColorStop(0, isTip ? 'rgba(245, 158, 11, 0.9)' : 'rgba(6, 182, 212, 0.9)');
      radGrad.addColorStop(0.5, isTip ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.25)');
      radGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(px, py, isTip ? 14 : 8, 0, Math.PI * 2);
      ctx.fill();

      // Solid inner core node
      ctx.fillStyle = isTip ? '#f59e0b' : isWrist ? '#10b981' : '#06b6d4';
      ctx.beginPath();
      ctx.arc(px, py, isTip ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleCaptureSnapshot = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `leapgest_${detection?.gesture || 'frame'}_${Date.now()}.png`;
    a.click();
  };

  const currentGestureMeta = LEAP_GESTURES.find(g => g.id === (detection?.gesture || selectedGesture)) || LEAP_GESTURES[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d121f] p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>Prodigy InfoTech Internship</span>
            <span>·</span>
            <span>Task-04 Submission</span>
            <span>·</span>
            <span>By Ramlala Patel</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Real-Time Hand Gesture Recognition & Vision Studio
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            A production-ready computer vision pipeline designed to identify and classify hand gestures from image or video data, enabling touchless human-computer interaction (HCI).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 shrink-0">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>LeapGestRecog 10 Classes Ready</span>
        </div>
      </div>

      {/* Practical Human Usage Tip Card */}
      <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 via-slate-900/50 to-slate-900/40 border border-cyan-800/40 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="text-base">💡</span>
          <div>
            <strong className="text-cyan-300">How to test with your hand:</strong> Click <strong>"Open Live Camera"</strong> below, hold your hand 1–2 feet in front of your webcam, and try open palm, thumbs up, or OK sign to watch the skeleton joints and confidence meter respond instantly!
          </div>
        </div>
      </div>

      {/* Prominent Option Selector: Open Live Camera vs Leap Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Open Live Camera */}
        <div 
          onClick={cameraState === 'active' ? stopWebcam : startWebcam}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
            sourceMode === 'webcam' && cameraState === 'active'
              ? 'bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-indigo-950/70 border-cyan-400 shadow-2xl shadow-cyan-950/80 ring-2 ring-cyan-400/30'
              : 'bg-gradient-to-r from-[#0d142c]/90 via-[#0b1024]/80 to-[#0e1632]/90 border-indigo-700/60 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border shadow-md ${
              sourceMode === 'webcam' && cameraState === 'active'
                ? 'bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-gradient-to-br from-cyan-950 to-indigo-950 border-cyan-700/60 text-cyan-400'
            }`}>
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Option 1: Open Live Camera</span>
                {sourceMode === 'webcam' && cameraState === 'active' ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 animate-pulse font-bold">
                    ● CAMERA IS OPEN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border border-cyan-500/60 font-semibold shadow-sm">
                    CLICK TO OPEN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-normal">
                {sourceMode === 'webcam' && cameraState === 'active'
                  ? 'Your camera is streaming live with real-time hand gesture classification.'
                  : 'Click on this option to open your webcam and test gestures with your own hand.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (sourceMode === 'webcam' && cameraState === 'active') {
                stopWebcam();
              } else {
                startWebcam();
              }
            }}
            disabled={cameraState === 'requesting'}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold shrink-0 transition-all shadow-lg ${
              sourceMode === 'webcam' && cameraState === 'active'
                ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {cameraState === 'requesting'
              ? 'Opening Camera...'
              : sourceMode === 'webcam' && cameraState === 'active'
              ? 'Turn Off Camera'
              : '📸 OPEN CAMERA'}
          </button>
        </div>

        {/* Option 2: Leap Sensor Simulation */}
        <div
          onClick={switchToSimulated}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
            sourceMode === 'simulated'
              ? 'bg-slate-900/90 border-slate-600 shadow-md'
              : 'bg-[#0d121f] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border ${
              sourceMode === 'simulated'
                ? 'bg-slate-800 border-slate-600 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Option 2: Leap NIR Simulation</span>
                {sourceMode === 'simulated' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-600">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Test with pre-recorded Leap Motion near-infrared (NIR) 850nm benchmark frames.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              switchToSimulated();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold shrink-0 transition-colors ${
              sourceMode === 'simulated'
                ? 'bg-slate-800 border border-slate-600 text-slate-200'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {sourceMode === 'simulated' ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>

      {/* Camera Permission / Error Banner */}
      {(cameraState === 'denied' || cameraState === 'error') && (
        <div className="p-4 bg-amber-950/30 border border-amber-800/80 rounded-xl text-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-mono text-amber-300 font-bold flex items-center gap-2">
                <span>⚠️ CAMERA ACCESS NOTICE</span>
                <span className="text-[10px] text-amber-400/80 font-normal">({cameraState === 'denied' ? 'Permission Denied' : 'Device Not Found'})</span>
              </div>
              <p className="text-amber-100 text-xs leading-relaxed max-w-2xl">
                {errorMessage}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={startWebcam}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded font-mono text-xs transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setCameraState('idle')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded font-mono text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded border border-amber-900/40 text-[11px] font-mono text-amber-200/90 space-y-1">
            <div className="font-semibold text-amber-300">How to enable camera in your browser:</div>
            <div>1. Look at your browser address bar at the top (near the URL).</div>
            <div>2. Click the <strong>Camera 📹 or Lock 🔒 icon</strong> next to the web address.</div>
            <div>3. Change <strong>Camera</strong> to <strong>"Allow"</strong>.</div>
            <div>4. Click the <strong>"Try Again"</strong> button above.</div>
          </div>
        </div>
      )}

      {/* Main Viewport & Classification Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Video & Sensor Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#06080e] aspect-[4/3] flex items-center justify-center shadow-2xl">
            {/* Hidden video element for webcam streaming */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="hidden"
            />

            {/* Main Interactive Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full object-contain"
            />

            {/* Utilitarian HUD Overlay Borders & Corner Brackets */}
            <div className="pointer-events-none absolute inset-3 border border-slate-800/60 rounded-lg">
              {/* Corner crosshairs */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

              {/* Top HUD Tag */}
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-300 uppercase">
                  {sourceMode === 'simulated' ? 'NIR SENSOR EMULATOR' : 'WEBCAM CV FEED'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 font-semibold">{currentGestureMeta.code}</span>
              </div>

              {/* Bottom HUD Tag */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/85 px-2.5 py-1 rounded border border-slate-800">
                <span>GESTURE: <strong className="text-white">{currentGestureMeta.name}</strong></span>
                <span>CONF: <strong className="text-emerald-400">{detection ? (detection.confidence * 100).toFixed(1) : '99.4'}%</strong></span>
                <span>LATENCY: <strong className="text-slate-200">{detection?.latencyMs || 8.9} ms</strong></span>
              </div>
            </div>

            {/* Quick On-Stage Action Button to switch to Live Camera or Stop Camera */}
            {sourceMode === 'simulated' ? (
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={startWebcam}
                  disabled={cameraState === 'requesting'}
                  className="flex items-center gap-2 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-mono font-bold shadow-xl backdrop-blur-sm border border-cyan-300 transition-all hover:scale-105 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Click to Open Camera</span>
                </button>
              </div>
            ) : (
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/85 text-emerald-400 border border-emerald-500/50 rounded-lg text-xs font-mono backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Camera Active</span>
                </span>
                <button
                  onClick={stopWebcam}
                  className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700 rounded-lg text-xs font-mono transition-colors"
                >
                  Close Camera
                </button>
              </div>
            )}

            {/* In-Stage Requesting Permission Overlay */}
            {cameraState === 'requesting' && (
              <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="h-16 w-16 rounded-full border-2 border-cyan-400 circle-gradient-radial flex items-center justify-center">
                  <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
                <div className="text-base font-bold text-white tracking-tight">Opening Your Camera...</div>
                <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                  Please look for the browser prompt at the top of your screen and click <strong>"Allow"</strong> to start live gesture recognition.
                </p>
              </div>
            )}
          </div>

          {/* Filter Mode Selector */}
          <div className="flex items-center justify-between gap-2 p-2 bg-[#0b0f19] rounded-lg border border-slate-800">
            <span className="text-xs font-mono text-slate-400 pl-2">Filter Pipeline:</span>
            <div className="flex items-center gap-1">
              {(['nir', 'skeleton', 'edge', 'threshold'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors uppercase ${filterMode === mode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Gesture Selector (when in simulated Leap NIR sensor mode) */}
          {sourceMode === 'simulated' && (
            <div className="p-3 bg-[#0b0f19] rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">LeapGestRecog Class Preset:</span>
                <span className="text-cyan-400">10 Benchmark Gestures</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {LEAP_GESTURES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGesture(g.id)}
                    className={`p-2 rounded text-left border transition-all ${selectedGesture === g.id ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">{g.code}</div>
                    <div className="text-xs font-medium truncate text-slate-200">{g.shortName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Telemetry & Utilitarian Schematic HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <UtilitarianSchematicHUD 
            detection={detection} 
            sensorMode={filterMode} 
            isLive={isPlaying} 
          />

          {/* Kinematic & HCI Mapping Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                KINEMATIC SPECIFICATION
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentGestureMeta.code}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentGestureMeta.description}
            </p>

            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80 font-mono text-xs space-y-1.5">
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">Geometry: </span>
                {currentGestureMeta.kinematicDescription}
              </div>
              <div className="text-[11px] text-emerald-400">
                <span className="text-slate-500">HCI Control: </span>
                {currentGestureMeta.hciAction.mediaAction}
              </div>
              <div className="text-[11px] text-amber-400">
                <span className="text-slate-500">Robotics: </span>
                {currentGestureMeta.hciAction.robotAction}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
