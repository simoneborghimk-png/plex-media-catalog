import React from 'react';
import { getResolutionBadgeStyle, getSectionMeta } from '../../utils/formatters';
import { MediaSection } from '../../types/catalog';

interface ResolutionBadgeProps {
  resolution: string;
  size?: 'sm' | 'md';
}

export const ResolutionBadge: React.FC<ResolutionBadgeProps> = ({ resolution, size = 'sm' }) => {
  const style = getResolutionBadgeStyle(resolution);
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border tracking-wide font-mono uppercase ${style.bg} ${style.text} ${style.border} ${style.glow || ''} ${sizeClass}`}
    >
      {resolution || 'N/D'}
    </span>
  );
};

interface SectionBadgeProps {
  section: MediaSection;
  size?: 'sm' | 'md';
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({ section, size = 'sm' }) => {
  const meta = getSectionMeta(section);
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${sizeClass}`}
    >
      {meta.label}
    </span>
  );
};

interface CodecBadgeProps {
  codec: string;
  type?: 'video' | 'audio';
}

export const CodecBadge: React.FC<CodecBadgeProps> = ({ codec, type = 'video' }) => {
  const isVideo = type === 'video';
  const colorClass = isVideo
    ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/40'
    : 'bg-emerald-950/70 text-emerald-300 border-emerald-700/40';

  return (
    <span
      className={`inline-flex items-center text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${colorClass}`}
    >
      {codec}
    </span>
  );
};
