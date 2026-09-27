import React from 'react';
import {
  Film,
  Tv,
  Sparkles,
  Smile,
  Clock,
  HardDrive,
  Layers
} from 'lucide-react';
import { UnifiedMediaItem } from '../../types/catalog';
import { ResolutionBadge, SectionBadge } from '../common/Badge';
import { formatDuration, formatStorage } from '../../utils/formatters';
import { getPosterUrl } from '../../utils/poster';

interface MediaCardProps {
  item: UnifiedMediaItem;
  onSelect: (item: UnifiedMediaItem) => void;
}

// Generates dynamic atmospheric color hues for cards without posters
function getCardGradient(id: number, section: string): string {
  const hues: Record<string, string[]> = {
    film: [
      'from-amber-950/40 via-slate-900 to-[#121824]',
      'from-blue-950/40 via-slate-900 to-[#121824]',
      'from-purple-950/40 via-slate-900 to-[#121824]',
      'from-emerald-950/40 via-slate-900 to-[#121824]'
    ],
    serie_tv: [
      'from-cyan-950/40 via-slate-900 to-[#121824]',
      'from-indigo-950/40 via-slate-900 to-[#121824]'
    ],
    anime: [
      'from-rose-950/40 via-slate-900 to-[#121824]',
      'from-fuchsia-950/40 via-slate-900 to-[#121824]'
    ],
    cartoon: [
      'from-teal-950/40 via-slate-900 to-[#121824]',
      'from-emerald-950/40 via-slate-900 to-[#121824]'
    ]
  };

  const pool = hues[section] || hues.film;
  return pool[id % pool.length];
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onSelect }) => {
  const gradient = getCardGradient(item.id, item.section);
  const isSeries = item.section !== 'film';
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex flex-col rounded-xl border border-white/[0.08] bg-[#141b29] hover:bg-[#192234] hover:border-amber-500/40 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.8),0_0_15px_rgba(229,160,13,0.15)] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Visual Header / Poster Banner */}
      <div className={`relative h-36 w-full bg-gradient-to-b ${gradient} p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden border-b border-white/[0.05]`}>
        {/* Real Poster Image (if available) */}
        {!imgError && (
          <img
            src={getPosterUrl(item.id)}
            alt={item.titolo}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Dark Vignette Overlay for badge & text contrast */}
        {!imgError && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-black/40 to-black/60 pointer-events-none" />
        )}

        {/* Subtle background decorative graphic (visible when no poster or fallback) */}
        {imgError && (
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-white select-none pointer-events-none">
            {item.section === 'film' && <Film className="w-32 h-32" />}
            {item.section === 'serie_tv' && <Tv className="w-32 h-32" />}
            {item.section === 'anime' && <Sparkles className="w-32 h-32" />}
            {item.section === 'cartoon' && <Smile className="w-32 h-32" />}
          </div>
        )}

        {/* Top Badges Row */}
        <div className="relative z-10 flex items-center justify-between gap-1.5">
          <SectionBadge section={item.section} />
          <ResolutionBadge resolution={item.risoluzione} />
        </div>

        {/* Year and Series Specs pill */}
        <div className="relative z-10 flex items-center justify-between">
          {item.anno ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-black/75 backdrop-blur-md text-slate-200 border border-white/[0.15]">
              {item.anno}
            </span>
          ) : <span />}

          {isSeries && item.numero_stagioni > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>{item.numero_stagioni} {item.numero_stagioni === 1 ? 'Stagione' : 'Stagioni'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-3 flex flex-col justify-between gap-2.5">
        <div>
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug"
            title={item.titolo}
          >
            {item.titolo}
          </h3>

          {/* Original Title if present and different */}
          {item.titolo_originale && item.titolo_originale !== item.titolo && (
            <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
              {item.titolo_originale}
            </p>
          )}

          {/* Genres Chips */}
          <div className="flex flex-wrap gap-1 mt-2">
            {item.generi.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.05]"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis preview */}
          {item.trama && (
            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed font-sans">
              {item.trama}
            </p>
          )}
        </div>

        {/* Technical Footer Row */}
        <div className="pt-2 border-t border-white/[0.06]">
          {/* Duration & Size info */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>
                {isSeries
                  ? `${item.numero_episodi} ep`
                  : formatDuration(item.durata_min)}
              </span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-slate-300">
              <HardDrive className="w-3 h-3 text-slate-400" />
              <span>{formatStorage(item.dimensione_gb)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

