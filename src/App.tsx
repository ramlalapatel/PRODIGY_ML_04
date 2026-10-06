/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  Database, 
  Cpu, 
  Sliders, 
  Upload, 
  ExternalLink, 
  Github, 
  HelpCircle,
  Terminal,
  Activity,
  Layers,
  Camera
} from 'lucide-react';
import { GestureId } from './types/gestures';
import { VisionStudio } from './components/VisionStudio';
import { DatasetExplorer } from './components/DatasetExplorer';
import { HCIControlPlayground } from './components/HCIControlPlayground';
import { NeuralArchitecture } from './components/NeuralArchitecture';
import { UploadTestBench } from './components/UploadTestBench';
import { ProjectNotes } from './components/ProjectNotes';
import { ThemeSelector } from './components/ThemeSelector';
import { GitHubModal } from './components/GitHubModal';
import { DATASET_STATS, LEAP_GESTURES } from './data/leapGestures';
import { THEMES, ThemeId } from './utils/theme';

type NavTab = 'vision' | 'dataset' | 'hci' | 'neural' | 'upload' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('vision');
  const [activeHciGesture, setActiveHciGesture] = useState<GestureId>('01_palm');
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('leapgest_theme') as ThemeId) || 'aurora';
  });

  const handleOpenLiveCamera = () => {
    setActiveTab('vision');
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setCurrentTheme(newTheme);
    try {
      localStorage.setItem('leapgest_theme', newTheme);
    } catch (e) {
      // Ignore in strict sandboxes
    }
  };

  return (
    <div 
      data-theme={currentTheme}
      className="min-h-screen text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-app, #050816)',
        color: 'var(--text-main, #f8fafc)',
      }}
    >
      
      {/* Background Subtle Pattern & Vibrant Aurora Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-schematic-grid opacity-35 z-0" />
      <div className="fixed inset-0 pointer-events-none aurora-mesh-glow opacity-75 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] circle-gradient-radial opacity-50 pointer-events-none z-0" />

      {/* =========================================================================
          TOP BAR CONTRACT (Strict 3-Zone Architecture)
          Zone 1: Single text element wordmark
          Zone 2: 4-6 text navigation links
          Zone 3: 1-2 primary actions
          ========================================================================= */}
      <header 
        style={{
          backgroundColor: 'var(--bg-nav, rgba(5, 8, 22, 0.94))',
          borderColor: 'var(--border-subtle, #1e2850)',
        }}
        className="sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3.5 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full border border-cyan-400/60 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
            </div>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('vision'); }}
              className="text-base font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-100 to-indigo-300 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              PRODIGY INFOTECH · TASK-04
            </a>
          </div>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-medium text-slate-400">
            <button
              onClick={() => setActiveTab('vision')}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap pb-0.5 ${activeTab === 'vision' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
            >
              Vision Studio
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap pb-0.5 ${activeTab === 'dataset' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
            >
              Leap Dataset
            </button>
            <button
              onClick={() => setActiveTab('hci')}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap pb-0.5 ${activeTab === 'hci' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
            >
              Gesture HCI
            </button>
            <button
              onClick={() => setActiveTab('neural')}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap pb-0.5 ${activeTab === 'neural' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
            >
              Neural Model
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap pb-0.5 ${activeTab === 'upload' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
            >
              Test Bench
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`hover:text-cyan-300 transition-colors whitespace-nowrap pb-0.5 ${activeTab === 'about' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
            >
              Project Notes
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions, Theme Selector, and GitHub Push */}
          <div className="flex items-center gap-2">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />

            <button
              onClick={() => setShowGitHubModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-[#0e1632] hover:bg-[#152048] border border-indigo-700/60 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
              title="Push to GitHub & copy git commands"
            >
              <Github className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">GitHub Push</span>
            </button>

            <button
              onClick={handleOpenLiveCamera}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                isCameraActive
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-sm'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-600/70 text-cyan-200'
              }`}
              title="Open your webcam for real-time gesture tracking"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCameraActive ? 'Camera Live' : 'Open Camera'}</span>
              {isCameraActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />}
            </button>

            <button
              onClick={() => setShowDocsModal(true)}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:text-white transition-colors whitespace-nowrap"
            >
              Brief
            </button>
          </div>

        </div>
      </header>

      {/* Sub-Header Metadata Ribbon with Quick Theme Switcher */}
      <div 
        style={{
          backgroundColor: 'var(--bg-card, #0d121f)',
          borderColor: 'var(--border-subtle, #1e293b)',
        }}
        className="border-b px-6 py-2.5 z-10 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Hand Gesture Recognition</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>LeapGestRecog Kaggle Dataset</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>GTI-UPM Active NIR</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-400 font-mono">10 Gestures / 20k Frames</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            {/* Quick Theme Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Theme:</span>
              {(['aurora', 'midnight', 'emerald', 'violet', 'amber', 'light'] as ThemeId[]).map((t) => {
                const isSelected = currentTheme === t;
                const def = THEMES[t];
                return (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] capitalize transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/25 via-indigo-500/25 to-rose-500/25 text-white border border-cyan-400/60 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${def.badgeColor}`} />
                    <span>{t === 'aurora' ? '✨ Aurora' : t}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">99.41% Accuracy</span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#090d16] border-b border-slate-800 p-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('vision')}
          className={`px-2 py-1 rounded ${activeTab === 'vision' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'}`}
        >
          Vision
        </button>
        <button
          onClick={() => setActiveTab('dataset')}
          className={`px-2 py-1 rounded ${activeTab === 'dataset' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'}`}
        >
          Dataset
        </button>
        <button
          onClick={() => setActiveTab('hci')}
          className={`px-2 py-1 rounded ${activeTab === 'hci' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'}`}
        >
          HCI
        </button>
        <button
          onClick={() => setActiveTab('neural')}
          className={`px-2 py-1 rounded ${activeTab === 'neural' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'}`}
        >
          Model
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-2 py-1 rounded ${activeTab === 'upload' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'}`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-2 py-1 rounded ${activeTab === 'about' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'}`}
        >
          Notes
        </button>
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 z-10">
        {activeTab === 'vision' && (
          <VisionStudio 
            onSelectGestureForHCI={(g) => setActiveHciGesture(g)}
            activeHciGesture={activeHciGesture}
            onCameraStateChange={setIsCameraActive}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetExplorer />
        )}

        {activeTab === 'hci' && (
          <HCIControlPlayground 
            activeGesture={activeHciGesture}
            onTriggerGesture={(g) => setActiveHciGesture(g)}
            onOpenLiveCamera={() => setActiveTab('vision')}
            isCameraActive={isCameraActive}
          />
        )}

        {activeTab === 'neural' && (
          <NeuralArchitecture />
        )}

        {activeTab === 'upload' && (
          <UploadTestBench />
        )}

        {activeTab === 'about' && (
          <ProjectNotes />
        )}
      </main>

      {/* Utilitarian Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#06080e] py-6 px-6 z-10 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Prodigy InfoTech Internship Program</span>
            <span>—</span>
            <span>Task-04: Hand Gesture Recognition Model & HCI Control Systems</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowGitHubModal(true)}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-slate-300 font-semibold"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub: patelramlala414/PRODIGY_ML_04</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>
            <span>·</span>
            <a 
              href={DATASET_STATS.kaggleUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>Kaggle LeapGestRecog</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <span>Universidad Politécnica de Madrid (GTI-UPM)</span>
          </div>
        </div>
      </footer>

      {/* GitHub Repository & Push Commands Modal */}
      <GitHubModal 
        isOpen={showGitHubModal} 
        onClose={() => setShowGitHubModal(false)} 
      />

      {/* Task & Dataset Brief Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d121f] border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase">
                  PRODIGY INFOTECH · TASK-04 SPECIFICATION
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  Hand Gesture Recognition System & Dataset Brief
                </h3>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                <strong>Task Objective:</strong> Develop a hand gesture recognition model that can accurately identify and classify different hand gestures from image or video data, enabling intuitive human-computer interaction (HCI) and gesture-based control systems.
              </p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="text-cyan-400 font-bold">Kaggle Benchmark: LeapGestRecog (GTI-UPM)</div>
                <div>• Dataset Size: 20,000 Near-Infrared (NIR) 850nm stereo sensor frames</div>
                <div>• Subjects: 10 subjects (5 male, 5 female)</div>
                <div>• 10 Gesture Classes: 01_palm, 02_l, 03_fist, 04_fist_moved, 05_thumb, 06_index, 07_ok, 08_palm_moved, 09_c, 10_down</div>
                <div>• Model Architecture: 4-Block Convolutional Neural Network (Conv2D + BN + MaxPool + Dropout + Dense Softmax)</div>
                <div>• Benchmark Test Accuracy: 99.41% with 8.9ms edge inference latency</div>
              </div>

              <p>
                <strong>HCI Applications Implemented in Studio:</strong>
                <br />
                1. <em>Spatial 3D CAD Manipulator</em>: Real-time orbit, grab translation, zoom, and wireframe vertex inspection.
                <br />
                2. <em>Articulated Robotic Gripper</em>: 5-axis kinematic teleoperation with live torque & grip pressure gauges.
                <br />
                3. <em>Presentation Deck & Media Hub</em>: Touchless slide advancement, volume attenuation, play/pause.
                <br />
                4. <em>Smart Laboratory Console</em>: Temperature dial, illuminance modulation, safety interlocks.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
