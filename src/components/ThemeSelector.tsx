import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { THEMES, ThemeId } from '../utils/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const activeTheme = THEMES[currentTheme] || THEMES.aurora;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-200 transition-colors shadow-sm"
        title="Change application background theme"
      >
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline font-medium">{activeTheme.label}</span>
        <div className={`w-2.5 h-2.5 rounded-full ${activeTheme.badgeColor} shadow-sm`} />
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-700 bg-[#0d121f] p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl">
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800 flex justify-between">
            <span>Color Palette & Theme</span>
            <span className="text-cyan-400">6 Curated Themes</span>
          </div>

          {(Object.keys(THEMES) as ThemeId[]).map((key) => {
            const theme = THEMES[key];
            const isSelected = currentTheme === key;

            return (
              <button
                key={key}
                onClick={() => {
                  onThemeChange(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border border-cyan-400/80 text-white font-semibold shadow-md'
                    : 'hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border border-white/20 ${theme.badgeColor} shadow-sm shrink-0`} />
                  <div>
                    <div className="text-xs font-medium flex items-center gap-1.5">
                      <span>{theme.name}</span>
                      {key === 'aurora' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight line-clamp-1 mt-0.5">
                      {theme.description}
                    </div>
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
