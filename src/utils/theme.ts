export type ThemeId = 'aurora' | 'midnight' | 'emerald' | 'violet' | 'amber' | 'light';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  label: string;
  description: string;
  badgeColor: string;
  previewGradient: string;
  colors: {
    bgApp: string;
    bgHeader: string;
    bgCard: string;
    bgInner: string;
    border: string;
    borderAccent: string;
    accent: string;
    accentGlow: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    isDark: boolean;
  };
}

export const THEMES: Record<ThemeId, ThemeDef> = {
  aurora: {
    id: 'aurora',
    name: 'Cyber Aurora (Best)',
    label: 'Cyber Aurora',
    description: 'Vibrant chromatic sapphire with electric cyan, violet, and neon sunset glows',
    badgeColor: 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-rose-400',
    previewGradient: 'from-cyan-500 via-indigo-600 to-rose-500',
    colors: {
      bgApp: 'bg-[#050816]',
      bgHeader: 'bg-[#050816]/92',
      bgCard: 'bg-[#0d142c]',
      bgInner: 'bg-[#070b1e]',
      border: 'border-indigo-900/60',
      borderAccent: 'border-cyan-400/60',
      accent: 'text-cyan-300',
      accentGlow: 'rgba(6, 182, 212, 0.35)',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-200',
      textMuted: 'text-indigo-300/70',
      isDark: true,
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Cyan',
    label: 'Midnight Cyan',
    description: 'Deep obsidian slate with phosphor cyan telemetry',
    badgeColor: 'bg-cyan-500',
    previewGradient: 'from-cyan-500 to-blue-700',
    colors: {
      bgApp: 'bg-[#080b12]',
      bgHeader: 'bg-[#080b12]/90',
      bgCard: 'bg-[#0d121f]',
      bgInner: 'bg-[#06080e]',
      border: 'border-slate-800',
      borderAccent: 'border-cyan-500/50',
      accent: 'text-cyan-400',
      accentGlow: 'rgba(6, 182, 212, 0.25)',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      isDark: true,
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    label: 'Emerald Matrix',
    description: 'Deep bio-cybernetic forest with luminous mint phosphor',
    badgeColor: 'bg-emerald-500',
    previewGradient: 'from-emerald-400 to-teal-700',
    colors: {
      bgApp: 'bg-[#040d0a]',
      bgHeader: 'bg-[#040d0a]/90',
      bgCard: 'bg-[#081813]',
      bgInner: 'bg-[#030907]',
      border: 'border-emerald-900/60',
      borderAccent: 'border-emerald-500/50',
      accent: 'text-emerald-400',
      accentGlow: 'rgba(16, 185, 129, 0.25)',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200/80',
      textMuted: 'text-emerald-600/70',
      isDark: true,
    },
  },
  violet: {
    id: 'violet',
    name: 'Cosmic Violet',
    label: 'Cosmic Violet',
    description: 'Deep nebula space with electric violet and indigo beams',
    badgeColor: 'bg-violet-500',
    previewGradient: 'from-violet-400 to-fuchsia-700',
    colors: {
      bgApp: 'bg-[#0a0614]',
      bgHeader: 'bg-[#0a0614]/90',
      bgCard: 'bg-[#130d24]',
      bgInner: 'bg-[#07040e]',
      border: 'border-purple-950/80',
      borderAccent: 'border-violet-500/50',
      accent: 'text-violet-400',
      accentGlow: 'rgba(139, 92, 246, 0.25)',
      textPrimary: 'text-purple-50',
      textSecondary: 'text-purple-200/80',
      textMuted: 'text-purple-500/60',
      isDark: true,
    },
  },
  amber: {
    id: 'amber',
    name: 'Amber Horizon',
    label: 'Amber Horizon',
    description: 'Warm obsidian charcoal with molten golden amber highlights',
    badgeColor: 'bg-amber-500',
    previewGradient: 'from-amber-400 to-orange-700',
    colors: {
      bgApp: 'bg-[#0c0a09]',
      bgHeader: 'bg-[#0c0a09]/90',
      bgCard: 'bg-[#181412]',
      bgInner: 'bg-[#080706]',
      border: 'border-stone-800',
      borderAccent: 'border-amber-500/50',
      accent: 'text-amber-400',
      accentGlow: 'rgba(245, 158, 11, 0.25)',
      textPrimary: 'text-amber-50',
      textSecondary: 'text-stone-300',
      textMuted: 'text-stone-500',
      isDark: true,
    },
  },
  light: {
    id: 'light',
    name: 'Clinical Lab White',
    label: 'Clinical Lab White',
    description: 'Sterile high-contrast hospital & research laboratory mode',
    badgeColor: 'bg-sky-600',
    previewGradient: 'from-sky-400 to-blue-600',
    colors: {
      bgApp: 'bg-[#f8fafc]',
      bgHeader: 'bg-[#ffffff]/90',
      bgCard: 'bg-[#ffffff]',
      bgInner: 'bg-[#f1f5f9]',
      border: 'border-slate-200',
      borderAccent: 'border-sky-500',
      accent: 'text-sky-600',
      accentGlow: 'rgba(2, 132, 199, 0.15)',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      isDark: false,
    },
  },
};
