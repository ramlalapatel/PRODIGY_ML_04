import React, { useState } from 'react';
import { 
  Github, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Download,
  AlertCircle,
  FolderArchive,
  ArrowRight
} from 'lucide-react';
import { downloadProjectZip } from '../utils/zipExporter';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/patelramlala414/PRODIGY_ML_04');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const pushCommand = `git init\ngit add .\ngit commit -m "feat: Prodigy InfoTech Task-04 Hand Gesture Recognition & HCI Studio"\ngit branch -M main\ngit remote add origin ${repoUrl.trim().endsWith('.git') ? repoUrl.trim() : `${repoUrl.trim()}.git`}\ngit push -u origin main`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip();
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-indigo-500/40 bg-[#0d142c] p-5 md:p-6 text-slate-200 shadow-2xl relative"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(99,102,241,0.25)',
        }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-indigo-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-indigo-900/60 pb-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 text-white shadow-lg">
              <Github className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  GitHub Repository Setup & Download
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-semibold">
                  Task-04
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Prodigy InfoTech Internship · Author: Ramlala Patel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 py-4 text-xs relative z-10">
          
          {/* Why link was not found notice */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/40 border border-amber-600/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-200 block text-xs">
                Link kyun nahi mili thi? (Why was the link not working?)
              </strong>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                GitHub par link tab banti hai jab aap pehle <strong>GitHub par nayi repository create</strong> karte hain! Kyunki bina aapke account login ke AI directly aapke GitHub par upload nahi kar sakta. Niche diye gaye <strong>2 aasan tarike</strong> se aap 1 minute me link bana sakte hain:
              </p>
            </div>
          </div>

          {/* METHOD 1: 1-Click ZIP Download (No Terminal Needed) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/50 to-[#070b1e] border-2 border-cyan-500/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">
                  METHOD 1 (SABSE AASAN · 1 MINUTE)
                </span>
                <span className="font-semibold text-white">ZIP Download & Web Upload</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-medium">Terminal ki zaroorat nahi</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal">
              1. Niche <strong>"Download Project (.ZIP)"</strong> button par click karke code download karein.<br />
              2. <strong>github.com/new</strong> par jaakar repository banayein aur files drag & drop karke upload kar dein!
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isDownloading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isDownloading ? 'Bundling ZIP...' : '1-Click: Download Project (.ZIP)'}</span>
              </button>

              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs transition-colors"
              >
                <span>github.com/new Kholein</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* METHOD 2: Terminal Push (Git Commands) */}
          <div className="p-4 rounded-xl bg-[#070b1f] border border-indigo-900/60 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">
                  METHOD 2
                </span>
                <span className="font-semibold text-white">Terminal / VS Code se Git Push</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">VS Code Terminal</span>
            </div>

            {/* Target Repo Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-semibold text-slate-400">
                Aapka GitHub Repository Link:
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/patelramlala414/PRODIGY_ML_04"
                className="w-full px-3 py-2 rounded-lg bg-[#040714] border border-indigo-800/80 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Commands Box */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" /> Terminal Commands:
                </span>
                <button
                  onClick={() => copyToClipboard(pushCommand, 1)}
                  className="text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-1"
                >
                  {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 1 ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <div className="rounded-lg bg-[#040714] border border-indigo-950 p-2.5 font-mono text-[11px] text-cyan-200/90 overflow-x-auto select-all leading-relaxed">
                <pre className="whitespace-pre">{pushCommand}</pre>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-indigo-900/60 pt-3 relative z-10 text-xs">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-200 transition-colors font-mono"
          >
            <span>Direct Repo Link: {repoUrl}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-mono text-xs transition-colors ml-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
