import React from 'react';
import { DetectionResult } from '../types/gestures';
import { LEAP_GESTURES } from '../data/leapGestures';

interface UtilitarianSchematicHUDProps {
  detection: DetectionResult | null;
  sensorMode?: 'nir' | 'rgb' | 'edge' | 'skeleton' | 'threshold';
  isLive?: boolean;
}

export const UtilitarianSchematicHUD: React.FC<UtilitarianSchematicHUDProps> = ({
  detection,
  sensorMode = 'nir',
  isLive = true,
}) => {
  const currentGesture = LEAP_GESTURES.find(g => g.id === detection?.gesture) || LEAP_GESTURES[0];
  const confidencePercent = detection ? (detection.confidence * 100).toFixed(1) : '99.4';
  const fps = detection?.fps ?? 60;
  const latency = detection?.latencyMs ?? 9.2;
  const angle = detection?.angleDegrees ?? 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0b0f19] p-5 shadow-2xl">
      {/* Subtle Pattern Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-schematic-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-schematic-dots opacity-40" />

      {/* Top Schematic Telemetry Ribbon */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isLive ? 'bg-cyan-400 opacity-75' : 'bg-amber-400 opacity-75'}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isLive ? 'bg-cyan-500' : 'bg-amber-500'}`} />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-wider text-slate-400">
              Active Sensor Feed · LeapGestRecog 850nm Standard
            </div>
            <div className="text-sm font-semibold tracking-tight text-slate-200">
              {currentGesture.code} · {currentGesture.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block">Frame Rate / Latency</span>
            <span className="font-semibold text-slate-200 tabular-nums">{fps} FPS · {latency}ms</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Processing Mode</span>
            <span className="font-semibold text-cyan-400 capitalize">{sensorMode}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Model Confidence</span>
            <span className="font-semibold text-emerald-400 tabular-nums">{confidencePercent}%</span>
          </div>
        </div>
      </div>

      {/* Schematic Radial Reticle & Utilitarian Circle Labels */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        
        {/* Left Schematic Dial: Circle with gradient that fades to transparency */}
        <div className="relative flex flex-col items-center justify-center py-2">
          {/* Lined Contemporary Utilitarian Schematic Circle Label */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1 mb-3">
            <span>Hand Orientation & Tilt</span>
            <span className="text-cyan-400">0° - 360°</span>
          </div>

          <div className="relative h-44 w-44 flex items-center justify-center">
            {/* Concentric Circle with gradient that fades to transparency */}
            <div className="absolute inset-0 rounded-full circle-gradient-radial animate-pulse" />
            
            {/* Outer dotted schematic circle */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30" />
            
            {/* Mid ring with tick marks */}
            <div className="absolute inset-3 rounded-full border border-slate-700/60" />
            
            {/* Degree Markings */}
            <span className="absolute top-0 text-[9px] font-mono text-slate-500 -translate-y-1">0°</span>
            <span className="absolute right-0 text-[9px] font-mono text-slate-500 translate-x-1">90°</span>
            <span className="absolute bottom-0 text-[9px] font-mono text-slate-500 translate-y-1">180°</span>
            <span className="absolute left-0 text-[9px] font-mono text-slate-500 -translate-x-1">270°</span>

            {/* Sweep radar line */}
            <div 
              className="absolute h-1/2 w-[1px] bg-gradient-to-t from-cyan-400 to-transparent origin-bottom transition-transform duration-300"
              style={{ transform: `rotate(${angle}deg)` }}
            />

            {/* Center Core Circle with gradient */}
            <div className="h-14 w-14 rounded-full border border-cyan-500/40 bg-slate-900/80 p-1 flex flex-col items-center justify-center shadow-lg">
              <span className="text-[10px] font-mono text-slate-400">Angle</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{angle}°</span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-400 mt-2">
            Palm Normal Vector Alignment
          </span>
        </div>

        {/* Center Schematic Dial: Simple Gradient Half Circle Shape + Confidence Arc */}
        <div className="relative flex flex-col items-center justify-center py-2">
          {/* Lined Contemporary Utilitarian Schematic Circle Label */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1 mb-3">
            <span>Prediction Confidence</span>
            <span className="text-emerald-400">P(Gesture)</span>
          </div>

          <div className="relative h-44 w-44 flex flex-col items-center justify-center">
            {/* Simple Gradient Half Circle Shape (Top Arc) */}
            <div className="absolute top-2 w-36 h-18 gradient-half-circle-top border-t-2 border-x-2 border-cyan-400/50" />
            
            {/* Concentric Circle with gradient */}
            <div className="h-28 w-28 rounded-full border border-slate-800 circle-gradient-radial flex flex-col items-center justify-center p-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">Confidence</span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight">
                {confidencePercent}
                <span className="text-xs font-normal text-emerald-400 ml-0.5">%</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-400 mt-0.5">{currentGesture.shortName}</span>
            </div>

            {/* Simple Gradient Half Circle Shape (Bottom reflection) */}
            <div className="absolute bottom-2 w-36 h-18 gradient-half-circle-bottom border-b border-x border-slate-800/60 opacity-60" />
          </div>

          <span className="text-[10px] font-mono text-slate-400 mt-2">
            10-Class Softmax Posterior Score
          </span>
        </div>

        {/* Right Schematic Dial: Circle with gradient (Finger Flexion & Distance) */}
        <div className="relative flex flex-col items-center justify-center py-2">
          {/* Lined Contemporary Utilitarian Schematic Circle Label */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1 mb-3">
            <span>Digit Extension & Pinch</span>
            <span className="text-amber-400">21 Points</span>
          </div>

          <div className="relative h-44 w-44 flex items-center justify-center">
            {/* Circle with gradient */}
            <div className="absolute inset-2 rounded-full circle-gradient-amber" />
            <div className="absolute inset-4 rounded-full border border-slate-800" />
            <div className="absolute inset-8 rounded-full border border-dashed border-amber-500/20" />

            {/* 5 Finger State Indicators placed radially */}
            {detection && (
              <>
                {/* Thumb */}
                <div 
                  className={`absolute top-4 left-6 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border transition-colors ${detection.fingerStates.thumb ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
                  title="Thumb"
                >
                  T
                </div>
                {/* Index */}
                <div 
                  className={`absolute top-1 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border transition-colors ${detection.fingerStates.index ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
                  title="Index"
                >
                  I
                </div>
                {/* Middle */}
                <div 
                  className={`absolute top-4 right-6 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border transition-colors ${detection.fingerStates.middle ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
                  title="Middle"
                >
                  M
                </div>
                {/* Ring */}
                <div 
                  className={`absolute bottom-8 right-3 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border transition-colors ${detection.fingerStates.ring ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
                  title="Ring"
                >
                  R
                </div>
                {/* Pinky */}
                <div 
                  className={`absolute bottom-8 left-3 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border transition-colors ${detection.fingerStates.pinky ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
                  title="Pinky"
                >
                  P
                </div>
              </>
            )}

            {/* Inner Center Node */}
            <div className="h-12 w-12 rounded-full border border-amber-500/40 bg-slate-950 p-1 flex flex-col items-center justify-center">
              <span className="text-[9px] font-mono text-slate-400">PINCH</span>
              <span className="text-[11px] font-mono font-bold text-amber-400">
                {detection ? +(detection.pinchDistance * 100).toFixed(0) : 32}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-500 mt-2">
            Thumb-Index Proximity & Digit Extension
          </span>
        </div>

      </div>

      {/* Bottom Probability Bar Array across 10 LeapGestRecog classes */}
      <div className="relative z-10 border-t border-slate-800/80 pt-3">
        <div className="text-[10px] font-mono uppercase text-slate-500 mb-2 flex justify-between">
          <span>LeapGestRecog Class Probabilities (G01 - G10)</span>
          <span className="text-slate-400">Kaggle Leap Motion NIR Dataset Benchmark</span>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 font-mono text-xs">
          {LEAP_GESTURES.map(g => {
            const prob = detection?.probabilities[g.id] ?? 0.05;
            const isTop = detection?.gesture === g.id;
            return (
              <div 
                key={g.id}
                className={`flex flex-col rounded p-1.5 border transition-all ${isTop ? 'bg-cyan-950/40 border-cyan-500/80 shadow-sm' : 'bg-slate-900/60 border-slate-800/80 text-slate-400'}`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={`font-semibold ${isTop ? 'text-cyan-300' : 'text-slate-400'}`}>{g.code}</span>
                  <span className={isTop ? 'text-cyan-200' : 'text-slate-500'}>{(prob * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-200 ${isTop ? 'bg-cyan-400' : 'bg-slate-600'}`}
                    style={{ width: `${Math.max(4, prob * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] truncate text-slate-400 mt-1">{g.shortName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
