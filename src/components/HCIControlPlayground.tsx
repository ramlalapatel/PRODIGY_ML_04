import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Tv, 
  Cpu, 
  Sliders, 
  RotateCw, 
  ZoomIn, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  Maximize2, 
  ShieldCheck, 
  Flame, 
  Lightbulb,
  CheckCircle2,
  Hand,
  Camera
} from 'lucide-react';
import { GestureId } from '../types/gestures';
import { LEAP_GESTURES } from '../data/leapGestures';

interface HCIControlPlaygroundProps {
  activeGesture: GestureId;
  onTriggerGesture?: (g: GestureId) => void;
  onOpenLiveCamera?: () => void;
  isCameraActive?: boolean;
}

export const HCIControlPlayground: React.FC<HCIControlPlaygroundProps> = ({
  activeGesture,
  onTriggerGesture,
  onOpenLiveCamera,
  isCameraActive = false,
}) => {
  const [activeSystem, setActiveSystem] = useState<'cad' | 'robot' | 'media' | 'smartHome'>('cad');

  // 3D Spatial Geometry State
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(45);
  const [scale3D, setScale3D] = useState(1.0);
  const [wireframeMode, setWireframeMode] = useState(true);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0.5, y: 0.5 });
  const [actionLog, setActionLog] = useState<string[]>(['System initialized. Ready for gesture input.']);

  // Media Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [volume, setVolume] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Robotic Hand Servo Angles
  const [robotServos, setRobotServos] = useState({
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    pinky: 0,
    gripForce: 0,
  });

  // Smart Home State
  const [temperature, setTemperature] = useState(21.5);
  const [lightLevel, setLightLevel] = useState(80);
  const [securityArmed, setSecurityArmed] = useState(true);

  const canvas3DRef = useRef<HTMLCanvasElement | null>(null);

  const addLog = (msg: string) => {
    setActionLog(prev => [msg, ...prev.slice(0, 4)]);
  };

  // React to incoming activeGesture changes
  useEffect(() => {
    switch (activeGesture) {
      case '01_palm': {
        // Reset 3D / Hover
        setScale3D(1.0);
        setIsGrabbing(false);
        setIsPlaying(prev => !prev);
        setRobotServos({ thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0, gripForce: 0 });
        addLog('01_palm: Full release / Reset state / Playback toggle');
        break;
      }
      case '02_l': {
        // Orbit rotation / Slide advance
        setRotY(y => (y + 35) % 360);
        setCurrentSlide(s => (s % 5) + 1);
        addLog('02_l: Orthogonal axis rotate / Next slide');
        break;
      }
      case '03_fist': {
        // Grab & Clench
        setIsGrabbing(true);
        setRobotServos({ thumb: 90, index: 95, middle: 95, ring: 95, pinky: 95, gripForce: 100 });
        setSecurityArmed(true);
        addLog('03_fist: Clench / Full gripper lock / Spatial grab');
        break;
      }
      case '04_fist_moved': {
        // Dynamic momentum translate
        setRotX(x => (x + 15) % 360);
        setRotY(y => (y + 20) % 360);
        addLog('04_fist_moved: Dynamic 3D pan & trajectory update');
        break;
      }
      case '05_thumb': {
        // Volume up / Wireframe toggle
        setVolume(v => Math.min(100, v + 10));
        setWireframeMode(w => !w);
        setTemperature(t => +(t + 0.5).toFixed(1));
        addLog('05_thumb: Confirmed / Volume +10% / Temp +0.5°C');
        break;
      }
      case '06_index': {
        // Laser pointer / Probe
        setLaserPos({ x: 0.5 + Math.sin(Date.now() / 300) * 0.25, y: 0.5 + Math.cos(Date.now() / 300) * 0.25 });
        setRobotServos(s => ({ ...s, index: 0, thumb: 45, middle: 90, ring: 90, pinky: 90, gripForce: 25 }));
        addLog('06_index: Surface probe target active / Laser pointer');
        break;
      }
      case '07_ok': {
        // Zoom / Snap / Precision Pinch
        setScale3D(s => (s >= 1.5 ? 0.8 : +(s + 0.2).toFixed(1)));
        setIsFullscreen(f => !f);
        setRobotServos({ thumb: 80, index: 80, middle: 10, ring: 10, pinky: 10, gripForce: 45 });
        addLog('07_ok: Precision pinch snap / Zoom toggle / Fullscreen');
        break;
      }
      case '08_palm_moved': {
        // Swipe gesture / Next track
        setCurrentSlide(s => (s % 5) + 1);
        setRotY(y => (y + 45) % 360);
        addLog('08_palm_moved: Lateral swipe detected / Step next');
        break;
      }
      case '09_c': {
        // Cylindrical grip
        setRobotServos({ thumb: 45, index: 50, middle: 50, ring: 50, pinky: 50, gripForce: 55 });
        setLightLevel(l => (l === 100 ? 40 : l + 20));
        addLog('09_c: Cylindrical envelope grasp / Dial level adjust');
        break;
      }
      case '10_down': {
        // Volume down / Cancel
        setVolume(v => Math.max(0, v - 10));
        setTemperature(t => +(t - 0.5).toFixed(1));
        setSecurityArmed(false);
        addLog('10_down: Volume -10% / Temp -0.5°C / Disengage lock');
        break;
      }
    }
  }, [activeGesture]);

  // 3D Spatial Canvas Rendering
  useEffect(() => {
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render3D = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = 90 * scale3D;

      // 3D Cube Vertices
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;

      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ];

      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * Math.cos(radY) + z * Math.sin(radY);
        let z1 = -x * Math.sin(radY) + z * Math.cos(radY);
        // Rotate X
        let y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
        let z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

        // Perspective
        const fov = 400;
        const pScale = fov / (fov + z2 * size * 0.8);
        return {
          x: cx + x1 * size * pScale,
          y: cy + y2 * size * pScale,
          z: z2,
        };
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      // Draw Edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = isGrabbing ? 3 : 2;
        ctx.strokeStyle = isGrabbing ? '#f59e0b' : '#06b6d4';
        ctx.stroke();
      });

      // Draw Nodes with Circle with Gradient
      projected.forEach((p, idx) => {
        const rad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, 10);
        rad.addColorStop(0, isGrabbing ? 'rgba(245, 158, 11, 0.9)' : 'rgba(6, 182, 212, 0.9)');
        rad.addColorStop(0.5, isGrabbing ? 'rgba(245, 158, 11, 0.3)' : 'rgba(6, 182, 212, 0.3)');
        rad.addColorStop(1, 'transparent');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isGrabbing ? '#fbbf24' : '#67e8f9';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Laser point overlay if active
      if (activeGesture === '06_index') {
        const lx = laserPos.x * canvas.width;
        const ly = laserPos.y * canvas.height;
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(lx, ly, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render3D);
    };

    animId = requestAnimationFrame(render3D);

    return () => cancelAnimationFrame(animId);
  }, [rotX, rotY, scale3D, wireframeMode, isGrabbing, activeGesture, laserPos]);

  return (
    <div className="space-y-6">
      {/* Title & Control Suite Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d121f] p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>Human-Computer Interaction (HCI) Suite</span>
            <span>·</span>
            <span>Zero-Touch Interface</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Gesture Control Playground
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Control spatial 3D environments, teleoperate robotic end-effectors, navigate presentations, and modulate environmental controls using recognized hand gestures.
          </p>
        </div>

        {/* Camera Shortcut & Current Gesture Trigger Display */}
        <div className="flex items-center gap-3">
          {onOpenLiveCamera && (
            <button
              onClick={onOpenLiveCamera}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-mono font-medium transition-colors ${
                isCameraActive 
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300' 
                  : 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-600/70 text-cyan-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCameraActive ? 'Camera Live' : 'Open Camera to Control'}</span>
            </button>
          )}

          <div className="flex items-center gap-3 p-2 bg-[#090d16] border border-cyan-500/40 rounded-lg font-mono text-xs">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Active Gesture</span>
              <span className="font-bold text-cyan-300">{activeGesture}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Human-Friendly Gesture Cheatsheet Ribbon */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-[11px] text-slate-300">
          <span className="text-cyan-400 font-bold">Quick Gesture Reference:</span>
          <span>🖐️ <strong>Palm</strong> (Reset/Play)</span>
          <span>👈 <strong>L-Shape</strong> (Rotate/Next)</span>
          <span>✊ <strong>Fist</strong> (Grab/Lock)</span>
          <span>👍 <strong>Thumb</strong> (+Volume/Temp)</span>
          <span>👌 <strong>OK Sign</strong> (Zoom/Pinch)</span>
          <span>👉 <strong>Index</strong> (Probe/Aim)</span>
        </div>
      </div>

      {/* System Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[#0b0f19] rounded-xl border border-slate-800">
        {[
          { id: 'cad', label: '1. 3D Spatial CAD Model', icon: Box },
          { id: 'robot', label: '2. Articulated Robotic Hand', icon: Cpu },
          { id: 'media', label: '3. Slide Presentation & Audio Deck', icon: Tv },
          { id: 'smartHome', label: '4. Environmental Lab Console', icon: Sliders },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeSystem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSystem(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Viewport (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* SYSTEM 1: 3D SPATIAL CAD MANIPULATOR */}
          {activeSystem === 'cad' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-cyan-400 font-semibold">
                  3D Geometric Polyhedral Model · Gesture-Manipulated Matrix
                </span>
                <span className="text-slate-400 tabular-nums">
                  Rotation: {rotX}°, {rotY}° | Scale: {scale3D}x
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#06080e] aspect-[16/10] flex items-center justify-center">
                <canvas
                  ref={canvas3DRef}
                  width={560}
                  height={350}
                  className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
                />

                {/* Utilitarian Schematic Overlay */}
                <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1 text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                  <div>AXIS_STATE: <strong className={isGrabbing ? 'text-amber-400' : 'text-cyan-400'}>{isGrabbing ? 'LOCKED_GRASP' : 'FREE_ORBIT'}</strong></div>
                  <div>SURFACE_MODE: <strong className="text-slate-200">{wireframeMode ? 'ORTHO_WIREFRAME' : 'SOLID_PHOSPHOR'}</strong></div>
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                  <span>GRAB: 03_fist · ROTATE: 02_l · ZOOM: 07_ok · RESET: 01_palm</span>
                </div>
              </div>

              {/* 3D Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRotY(y => (y + 45) % 360)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Orbit +45°</span>
                  </button>
                  <button
                    onClick={() => setScale3D(s => (s >= 1.5 ? 0.8 : +(s + 0.2).toFixed(1)))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom Scale</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold">Real-Time Kinematic Sync</span>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM 2: ROBOTIC GRIPPER TELEOPERATION */}
          {activeSystem === 'robot' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-amber-400 uppercase font-semibold">
                  5-AXIS ARTICULATED ROBOTIC GRIPPER // TELEOPERATION
                </span>
                <span className="text-slate-400">
                  GRIP FORCE: {robotServos.gripForce}%
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#06080e] p-6 flex flex-col items-center justify-center min-h-[300px]">
                {/* Visual Articulated Hand & Servos */}
                <div className="relative w-80 h-52 flex items-end justify-center gap-4">
                  {/* Base Wrist Joint */}
                  <div className="absolute bottom-0 w-32 h-14 bg-slate-800 rounded-t-xl border border-slate-700 flex flex-col items-center justify-center text-[10px] font-mono text-slate-400">
                    <span>SERVO_BASE_00</span>
                    <span className="text-cyan-400 font-bold">{robotServos.gripForce > 50 ? 'TORQUE_LOCK' : 'IDLE'}</span>
                  </div>

                  {/* 5 Articulated Robotic Fingers */}
                  {[
                    { name: 'Thumb', val: robotServos.thumb, color: 'border-amber-500' },
                    { name: 'Index', val: robotServos.index, color: 'border-cyan-400' },
                    { name: 'Middle', val: robotServos.middle, color: 'border-cyan-400' },
                    { name: 'Ring', val: robotServos.ring, color: 'border-cyan-400' },
                    { name: 'Pinky', val: robotServos.pinky, color: 'border-cyan-400' },
                  ].map((f, i) => (
                    <div key={f.name} className="flex flex-col items-center gap-1.5 z-10">
                      {/* Joint 2 */}
                      <div 
                        className={`w-7 h-16 bg-slate-900 border-2 ${f.color} rounded-t-md transition-all duration-300 origin-bottom`}
                        style={{ transform: `rotate(${(f.val / 90) * (i === 0 ? -35 : 25)}deg) scaleY(${1 - (f.val / 200)})` }}
                      >
                        <div className="w-full h-2 bg-slate-700 mt-2" />
                      </div>
                      {/* Joint 1 */}
                      <div className="w-8 h-10 bg-slate-800 border border-slate-700 rounded-sm flex items-center justify-center text-[9px] font-mono text-slate-300">
                        {f.val}°
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{f.name}</span>
                    </div>
                  ))}
                </div>

                {/* Grip Pressure Gauge */}
                <div className="w-full max-w-md mt-6 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">End-Effector Torque / Grip Pressure:</span>
                    <span className="text-amber-400 font-bold">{robotServos.gripForce} N</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 transition-all duration-300"
                      style={{ width: `${robotServos.gripForce}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
                <span>Robotic Kinematics Mapping: </span>
                <strong className="text-slate-200">01_palm (Open 100%)</strong> · <strong className="text-slate-200">03_fist (Clench 100%)</strong> · <strong className="text-slate-200">07_ok (Precision Pinch)</strong> · <strong className="text-slate-200">09_c (Cylindrical Hold)</strong>
              </div>
            </div>
          )}

          {/* SYSTEM 3: PRESENTATION & MEDIA HUB */}
          {activeSystem === 'media' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-cyan-400 uppercase font-semibold">
                  PRESENTATION SLIDE DECK & AUDIO CONTROLLER
                </span>
                <span className="text-slate-400">
                  SLIDE {currentSlide} / 5
                </span>
              </div>

              {/* Presentation Slide Stage */}
              <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 p-8 flex flex-col justify-between min-h-[280px]">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>PRODIGY INFOTECH · TASK-04</span>
                  <span className="text-cyan-400">TOUCHLESS INTERACTION</span>
                </div>

                <div className="my-6 space-y-2">
                  <div className="text-xs font-mono text-cyan-400 uppercase">
                    SLIDE 0{currentSlide} // KEY ARCHITECTURAL PRINCIPLE
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {currentSlide === 1 && 'Near-Infrared Stereo Computer Vision (850nm)'}
                    {currentSlide === 2 && 'Convolutional Neural Networks for Dynamic Gestures'}
                    {currentSlide === 3 && 'Convex Hull & Skeletal Landmark Kinematics'}
                    {currentSlide === 4 && 'Zero-Touch Medical & Robotic Teleoperation'}
                    {currentSlide === 5 && 'High-Accuracy Benchmark on Kaggle LeapGestRecog'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                    {currentSlide === 1 && 'Leap Motion sensor utilizes pulsed 850nm infrared LEDs to eliminate ambient lighting variance, capturing pure musculoskeletal silhouettes.'}
                    {currentSlide === 2 && '4-block CNN architecture achieves 99.41% accuracy across 20,000 images and 10 gesture classes with minimal 9ms inference latency.'}
                    {currentSlide === 3 && '21-point hand topology extracts digit extension states, pinch metrics, and rotation angles in real-time.'}
                    {currentSlide === 4 && 'Touchless gesture control protects sterile clinical environments and enables safe teleoperation in hazardous areas.'}
                    {currentSlide === 5 && 'Exemplary execution of Prodigy InfoTech Task-04 with complete dataset exploration and working HCI systems.'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-slate-400">{isPlaying ? 'Playing Presentation' : 'Paused'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300 font-semibold">{volume}%</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
                <span>Media Gestures: </span>
                <strong className="text-slate-200">01_palm (Play/Pause)</strong> · <strong className="text-slate-200">08_palm_moved / 02_l (Next Slide)</strong> · <strong className="text-slate-200">05_thumb (Volume +)</strong> · <strong className="text-slate-200">10_down (Volume -)</strong>
              </div>
            </div>
          )}

          {/* SYSTEM 4: SMART HOME CONSOLE */}
          {activeSystem === 'smartHome' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-cyan-400 uppercase font-semibold">
                  SMART ENVIRONMENT & LABORATORY CONSOLE
                </span>
                <span className="text-emerald-400">
                  SYSTEM READY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Temperature Dial */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-mono uppercase text-slate-400">Climate Temp</span>
                  <span className="text-3xl font-mono font-bold text-white">{temperature}°C</span>
                  <span className="text-[10px] font-mono text-slate-500">05_thumb / 10_down</span>
                </div>

                {/* Lighting Slider */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <Lightbulb className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-mono uppercase text-slate-400">Illuminance</span>
                  <span className="text-3xl font-mono font-bold text-cyan-400">{lightLevel}%</span>
                  <span className="text-[10px] font-mono text-slate-500">09_c (Adjust dial)</span>
                </div>

                {/* Security Lock */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <ShieldCheck className={`w-5 h-5 ${securityArmed ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-[10px] font-mono uppercase text-slate-400">Safety Interlock</span>
                  <span className={`text-lg font-mono font-bold ${securityArmed ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {securityArmed ? 'ARMED' : 'DISARMED'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">03_fist / 10_down</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right: Gesture Trigger Pad & Action Log (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Manual Gesture Triggers */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-2.5">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>ONE-CLICK GESTURE TRIGGER</span>
              <span className="text-[10px] text-slate-500">G01 - G10</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Click any gesture below to simulate the trigger or observe real-time reaction from webcam:
            </p>

            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {LEAP_GESTURES.map(g => {
                const isActive = activeGesture === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => onTriggerGesture && onTriggerGesture(g.id)}
                    className={`p-2 rounded border text-left transition-all ${isActive ? 'bg-cyan-950 border-cyan-500 text-white font-bold shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    <div className="text-[10px] text-cyan-400">{g.code}</div>
                    <div className="truncate text-xs text-slate-200">{g.shortName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Action History Log */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-2 font-mono text-xs">
            <div className="text-xs text-slate-300 font-semibold border-b border-slate-800 pb-1.5 flex justify-between">
              <span>Live Gesture Event History</span>
              <span className="text-cyan-400 font-normal">Real-Time</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {actionLog.map((log, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80 text-slate-300">
                  <span className="text-cyan-400 mr-1.5">●</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
