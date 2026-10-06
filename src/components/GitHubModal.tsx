import React, { useState } from 'react';
import { 
  Github, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  GitBranch, 
  UploadCloud, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/patelramlala414/PRODIGY_ML_04');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const pushCommand = `git init\ngit add .\ngit commit -m "feat: Prodigy InfoTech Task-04 Hand Gesture Recognition & HCI Studio"\ngit branch -M main\ngit remote add origin ${repoUrl.trim().endsWith('.git') ? repoUrl.trim() : `${repoUrl.trim()}.git`}\ngit push -u origin main`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-indigo-500/40 bg-[#0d142c] p-6 text-slate-200 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(99,102,241,0.25)',
        }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-indigo-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-indigo-900/60 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 text-white shadow-lg">
              <Github className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Push to GitHub & Repository Link
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-semibold">
                  Git Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Prodigy InfoTech Internship (Task-04) · Author: Ramlala Patel
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
        <div className="space-y-5 py-4 text-xs relative z-10">
          
          {/* Repository Target Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-cyan-300 flex items-center justify-between">
              <span>TARGET GITHUB REPOSITORY URL</span>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 transition-colors underline"
              >
                <span>Visit Repo on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository-name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b1f] border border-indigo-800/80 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Create New Repo</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* 3 Step Instruction Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#070b1f]/80 border border-indigo-900/50 space-y-1">
              <div className="font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                <span>Create Repo</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Go to <strong>github.com/new</strong> and create a public repository named <code>PRODIGY_ML_04</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070b1f]/80 border border-indigo-900/50 space-y-1">
              <div className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center text-[10px]">2</span>
                <span>Open Terminal</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Open your terminal in the project directory where your files are located.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070b1f]/80 border border-indigo-900/50 space-y-1">
              <div className="font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-[10px]">3</span>
                <span>Paste & Push</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Run the one-click commands below to link origin and push to <code>main</code> branch.
              </p>
            </div>
          </div>

          {/* Copyable Terminal Commands */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>TERMINAL COMMANDS TO RUN (COPY & PASTE)</span>
              </span>
              <button
                onClick={() => copyToClipboard(pushCommand, 1)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 transition-colors font-bold"
              >
                {copiedIndex === 1 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied All!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl bg-[#040714] border border-indigo-950 p-3.5 font-mono text-[11px] text-cyan-200/90 overflow-x-auto select-all leading-relaxed shadow-inner">
              <pre className="whitespace-pre">{pushCommand}</pre>
            </div>
          </div>

          {/* Repository Files Included Summary */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes <strong>README.md</strong>, <strong>package.json</strong>, <strong>.gitignore</strong>, and complete Prodigy Task-04 source code.</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-indigo-900/60 pt-4 relative z-10">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Open GitHub Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(pushCommand, 1)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 1 ? 'Copied to Clipboard!' : 'Copy Push Commands'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
