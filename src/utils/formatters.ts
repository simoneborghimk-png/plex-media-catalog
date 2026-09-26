import { MediaSection } from '../types/catalog';

export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return 'N/D';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function formatStorage(gb: number | null | undefined): string {
  if (gb === null || gb === undefined || isNaN(gb)) return '0 GB';
  if (gb >= 1000) {
    return `${(gb / 1024).toFixed(2)} TB`;
  }
  return `${gb.toFixed(2)} GB`;
}

export function getResolutionBadgeStyle(resolution: string): {
  bg: string;
  text: string;
  border: string;
  glow?: string;
} {
  const res = (resolution || '').toUpperCase();
  if (res.includes('4K') || res.includes('UHD') || res.includes('2160')) {
    return {
      bg: 'bg-purple-950/80',
      text: 'text-purple-300',
      border: 'border-purple-600/40',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.35)]'
    };
  }
  if (res.includes('1080') || res.includes('FHD')) {
    return {
      bg: 'bg-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      glow: 'shadow-[0_0_12px_rgba(56,189,248,0.25)]'
    };
  }
  if (res.includes('720') || res.includes('HD')) {
    return {
      bg: 'bg-teal-950/80',
      text: 'text-teal-300',
      border: 'border-teal-500/40'
    };
  }
  if (res.includes('576') || res.includes('480') || res.includes('SD')) {
    return {
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-600/40'
    };
  }
  return {
    bg: 'bg-zinc-800/70',
    text: 'text-zinc-400',
    border: 'border-zinc-700/40'
  };
}

export function getSectionMeta(section: MediaSection): {
  label: string;
  pluralLabel: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  switch (section) {
    case 'film':
      return {
        label: 'Film',
        pluralLabel: 'Film',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-950/60',
        badgeText: 'text-amber-300',
        badgeBorder: 'border-amber-600/30'
      };
    case 'serie_tv':
      return {
        label: 'Serie TV',
        pluralLabel: 'Serie TV',
        color: 'text-blue-400',
        badgeBg: 'bg-blue-950/60',
        badgeText: 'text-blue-300',
        badgeBorder: 'border-blue-600/30'
      };
    case 'anime':
      return {
        label: 'Anime',
        pluralLabel: 'Anime',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-950/60',
        badgeText: 'text-rose-300',
        badgeBorder: 'border-rose-600/30'
      };
    case 'cartoon':
      return {
        label: 'Cartoni',
        pluralLabel: 'Cartoni Animati',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/60',
        badgeText: 'text-emerald-300',
        badgeBorder: 'border-emerald-600/30'
      };
  }
}

export function formatChannels(canali: number | null | undefined): string {
  if (!canali) return '';
  if (canali === 2) return '2.0 Stereo';
  if (canali === 6) return '5.1 Surround';
  if (canali === 8) return '7.1 Surround';
  return `${canali} canali`;
}

export function cleanCodec(codec: string | undefined): string {
  if (!codec) return 'N/D';
  if (codec.toUpperCase().includes('HEVC') || codec.toUpperCase().includes('H265')) return 'HEVC (H.265)';
  if (codec.toUpperCase().includes('H264') || codec.toUpperCase().includes('AVC')) return 'H.264 / AVC';
  return codec.toUpperCase();
}
