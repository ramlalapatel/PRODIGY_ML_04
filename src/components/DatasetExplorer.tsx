import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Database, Layers, Eye, Sliders, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { GestureId } from '../types/gestures';
import { LEAP_GESTURES, DATASET_STATS } from '../data/leapGestures';
import { renderLeapNIRFrame } from '../utils/leapSensorSimulator';

export const DatasetExplorer: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('00');
  const [selectedGesture, setSelectedGesture] = useState<GestureId>('01_palm');
  const [frameIndex, setFrameIndex] = useState<number>(42);
  const [filterMode, setFilterMode] = useState<'nir' | 'edge' | 'threshold' | 'skeleton'>('nir');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render simulated sensor image for selected subject, gesture, and frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use subject and frame to introduce slight variance
    const subjectNum = parseInt(selectedSubject, 10);
    const timeOffset = subjectNum * 0.4 + (frameIndex / 200) * Math.PI * 2;

    renderLeapNIRFrame(ctx, canvas.width, canvas.height, selectedGesture, timeOffset, filterMode);
  }, [selectedSubject, selectedGesture, frameIndex, filterMode]);

  const currentMeta = LEAP_GESTURES.find(g => g.id === selectedGesture) || LEAP_GESTURES[0];
  const formattedFilename = `frame_${selectedSubject}_${currentMeta.folderName}_${frameIndex.toString().padStart(4, '0')}.png`;

  return (
    <div className="space-y-6">
      {/* Header and Dataset Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d121f] p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>Kaggle Dataset Benchmark</span>
            <span>·</span>
            <span>GTI-UPM Research</span>
            <span>·</span>
            <span>20,000 Images</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            LeapGestRecog Infrared Dataset Explorer
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            A comprehensive dataset collected by the GTI-UPM research group at Universidad Politécnica de Madrid. It contains 20,000 Near-Infrared (NIR) 850nm images captured with Leap Motion sensors across 10 subjects performing 10 distinct gestures.
          </p>
        </div>

        <a
          href={DATASET_STATS.kaggleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/70 border border-cyan-700 rounded-lg hover:bg-cyan-900/70 transition-colors w-fit shrink-0"
        >
          <Database className="w-3.5 h-3.5" />
          <span>View on Kaggle</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
        </a>
      </div>

      {/* Dataset Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800">
          <span className="text-[10px] uppercase text-slate-500 block">Total IR Frames</span>
          <span className="text-lg font-bold text-white tabular-nums">20,000</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">2,000 per gesture</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800">
          <span className="text-[10px] uppercase text-slate-500 block">Subjects</span>
          <span className="text-lg font-bold text-cyan-400 tabular-nums">10 Subjects</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">5 Female · 5 Male</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800">
          <span className="text-[10px] uppercase text-slate-500 block">Sensor Technology</span>
          <span className="text-lg font-bold text-amber-400 tabular-nums">850 nm NIR</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Leap Motion Stereo</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800">
          <span className="text-[10px] uppercase text-slate-500 block">Benchmark Accuracy</span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums">99.41 %</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">CNN 4-Block architecture</span>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Gesture & Subject Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Subject Selector */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-2">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              SUBJECT SELECTION (00 - 09)
            </div>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
              {DATASET_STATS.subjectIds.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`py-1.5 px-2 rounded border text-center transition-colors ${selectedSubject === sub ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  Sub-{sub}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block pt-1">
              Active: Subject {selectedSubject} ({parseInt(selectedSubject) % 2 === 0 ? 'Female' : 'Male'} demographic series)
            </span>
          </div>

          {/* Gesture Class List */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-2">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              LEAPGESTRECOG 10 CLASSES
            </div>
            <div className="space-y-1">
              {LEAP_GESTURES.map(g => {
                const isSelected = selectedGesture === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGesture(g.id)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${isSelected ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-sm' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                          {g.code}
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                          {g.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        {g.folderName} · 2,000 samples
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {g.accuracy}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Sensor Image Viewer & Preprocessing Pipeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
            {/* Top Bar with filename and controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-cyan-400 font-semibold">[FILE]</span>
                <span className="text-slate-200">{formattedFilename}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">640x240px NIR</span>
                <span className="text-slate-700">·</span>
                <span className="text-emerald-400">Class {currentMeta.code}</span>
              </div>
            </div>

            {/* Canvas Stage */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#05070d] aspect-[16/9] flex items-center justify-center shadow-inner">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-contain"
              />

              {/* Watermark-free Utilitarian Schematic Overlay */}
              <div className="pointer-events-none absolute inset-3 border border-slate-800/40 rounded flex flex-col justify-between p-2 text-[10px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>NIR: 850nm</span>
                  <span>RES: 640x360</span>
                </div>
                <div className="flex justify-between">
                  <span>SUB: {selectedSubject}</span>
                  <span>FRAME: #{frameIndex}/200</span>
                </div>
              </div>
            </div>

            {/* Frame Scrubber */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Frame Sequence Scrubber:</span>
                <span className="text-cyan-400 font-semibold">Frame {frameIndex} of 200</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFrameIndex(Math.max(1, frameIndex - 1))}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={frameIndex}
                  onChange={(e) => setFrameIndex(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => setFrameIndex(Math.min(200, frameIndex + 1))}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Pipeline Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Preprocessing Filter:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'nir', label: 'Raw Infrared' },
                  { id: 'edge', label: 'Sobel Gradients' },
                  { id: 'threshold', label: 'Otsu Binary' },
                  { id: 'skeleton', label: 'Landmark Topology' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterMode(f.id as any)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${filterMode === f.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kinematic & Sensor Feature Inspection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Class Kinematics</span>
                <p className="text-slate-300 text-xs leading-relaxed">{currentMeta.description}</p>
                <div className="text-[11px] font-mono text-cyan-400 pt-1">{currentMeta.kinematicDescription}</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">HCI Application Mapping</span>
                <div className="font-mono text-xs text-emerald-400">{currentMeta.hciAction.mediaAction}</div>
                <div className="font-mono text-xs text-amber-400">{currentMeta.hciAction.robotAction}</div>
                <div className="text-[11px] text-slate-400 pt-1">Folder: <code className="text-slate-200">leapGestRecog/{selectedSubject}/{currentMeta.folderName}/</code></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
