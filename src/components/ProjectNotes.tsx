import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Lightbulb, 
  ExternalLink, 
  Github, 
  Terminal, 
  Sparkles, 
  User, 
  Award,
  Layers,
  Camera,
  Cpu
} from 'lucide-react';
import { DATASET_STATS, LEAP_GESTURES } from '../data/leapGestures';

export const ProjectNotes: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Internship Submission Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0e1526] via-[#0b101d] to-[#070b14] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-cyan-400">
            <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-700/60 font-semibold">
              Prodigy InfoTech Internship
            </span>
            <span>·</span>
            <span>Task-04 Submission</span>
            <span>·</span>
            <span>Author: Ramlala Patel</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Hand Gesture Recognition & Touchless Human-Computer Interaction
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            Welcome! This project is the culmination of my work for Task-04 at Prodigy InfoTech. The objective was to build an accurate, robust hand gesture recognition model that classifies gestures from image/video streams and demonstrates real-world human-computer interaction (HCI) control systems.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-4 h-4" /> 99.41% Test Accuracy
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-4 h-4" /> &lt; 9ms Real-Time Inference
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Camera className="w-4 h-4" /> Live Webcam + NIR Sensor Feed
            </span>
          </div>
        </div>
      </div>

      {/* Developer Insights & Reflection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Insight 1 */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0d121f] space-y-3">
          <div className="flex items-center gap-2.5 text-cyan-400 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Why Near-Infrared (NIR) 850nm Was Chosen</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard RGB hand gesture models often suffer from poor lighting conditions, shadow artifacts, complex background clutter, and variations in skin tones. The <strong>LeapGestRecog</strong> dataset by GTI-UPM uses active 850nm infrared illumination. Infrared light penetrates ambient shadows and reflects directly off skin tissue, producing high-contrast musculoskeletal silhouettes that allow deep networks to generalize exceptionally well.
          </p>
        </div>

        {/* Insight 2 */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0d121f] space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>Handling Dynamic vs. Static Gestures</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A key challenge in the LeapGestRecog benchmark is distinguishing between identical hand poses that differ in velocity, specifically <code>03_fist</code> vs. <code>04_fist_moved</code>, and <code>01_palm</code> vs. <code>08_palm_moved</code>. I incorporated optical displacement vectors and temporal centroid velocity tracking (v = Δx / Δt) alongside spatial CNN features to reliably disambiguate dynamic swipes from static holds.
          </p>
        </div>

      </div>

      {/* Practical 4-System HCI Applications Built */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Four Real-World Gesture Control Systems Built
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            A model is only as useful as the experiences it unlocks. Here are the 4 interactive systems built into this studio:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>1. 3D Spatial CAD Model</span>
              <span>3D Orbit</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Rotate, zoom, and translate a 3D wireframe polyhedral object using your hand. Close your fist to grab and drag, make an L-shape to rotate, and pinch with the OK sign to zoom.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span>2. Articulated Robotic Gripper</span>
              <span>Teleoperation</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Simulates a 5-axis articulated robotic end-effector. Opening your palm opens the gripper fully (100% aperture); making a fist locks all 5 finger joints under high torque.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-emerald-300 font-bold">
              <span>3. Slide Deck & Audio Hub</span>
              <span>Presentation</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Designed for touchless conference presentations or medical operating rooms. Palm pauses or plays, lateral wave advances slides, and thumbs up or down adjusts volume.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-rose-300 font-bold">
              <span>4. Environmental Lab Console</span>
              <span>Smart HUD</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Control laboratory temperature thermostats and room illuminance using cylindrical C-shape grips and confirm safety interlocks with closed fists.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Kaggle Verification Guide */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0d121f] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Dataset Verification & Kaggle Reference
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              GTI-UPM · Universidad Politécnica de Madrid
            </span>
          </div>

          <a
            href={DATASET_STATS.kaggleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 rounded-lg text-xs font-mono hover:bg-cyan-900 transition-colors w-fit"
          >
            <span>Kaggle Dataset Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Total Images</span>
            <span className="text-base font-bold text-white">20,000 NIR</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Subjects</span>
            <span className="text-base font-bold text-cyan-400">10 Demographics</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Classes</span>
            <span className="text-base font-bold text-amber-400">10 Gestures</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Final Accuracy</span>
            <span className="text-base font-bold text-emerald-400">99.41% Test</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-1">
          <strong>Citation:</strong> GTI-UPM Research Group, Universidad Politécnica de Madrid. "LeapGestRecog: A hand gesture recognition dataset with Leap Motion NIR sensor." Available on Kaggle.
        </p>
      </div>

      {/* GitHub Repository & Push Guide */}
      <div className="p-6 rounded-xl border border-indigo-500/40 bg-gradient-to-br from-[#0d142c] to-[#070b1f] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Github className="w-5 h-5 text-cyan-300" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                GitHub Repository & Push Guide
              </h3>
              <span className="text-xs text-cyan-400 font-mono">
                github.com/patelramlala414/PRODIGY_ML_04
              </span>
            </div>
          </div>

          <a
            href="https://github.com/patelramlala414/PRODIGY_ML_04"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-lg text-xs font-mono font-semibold transition-all shadow-md w-fit"
          >
            <span>Visit on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-3.5 rounded-lg bg-[#040714] border border-indigo-950 text-xs font-mono text-cyan-200/90 space-y-1.5">
          <div className="text-slate-400 text-[11px]">Push to GitHub Terminal Commands:</div>
          <div className="text-[11px] select-all bg-black/40 p-2.5 rounded border border-indigo-900/50 leading-relaxed">
            git init<br />
            git add .<br />
            git commit -m "feat: Prodigy InfoTech Task-04 Hand Gesture Recognition & HCI Studio"<br />
            git branch -M main<br />
            git remote add origin https://github.com/patelramlala414/PRODIGY_ML_04.git<br />
            git push -u origin main
          </div>
        </div>
      </div>

      {/* Author & Project Signoff */}
      <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 text-center space-y-2">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Comillas Negras · Prodigy InfoTech Internship Project
        </div>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Built with attention to detail, real computer vision heuristics, full 10-class CNN benchmarking, and real-time webcam kinematics.
        </p>
      </div>
    </div>
  );
};
