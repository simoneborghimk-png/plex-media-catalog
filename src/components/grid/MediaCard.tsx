import React from 'react';
import {
  Film,
  Tv,
  Sparkles,
  Smile,
  Clock,
  HardDrive,
  Info,
  Layers
} from 'lucide-react';
import { UnifiedMediaItem } from '../../types/catalog';
import { ResolutionBadge, SectionBadge, CodecBadge } from '../common/Badge';
import { formatDuration, formatStorage } from '../../utils/formatters';

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

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex flex-col rounded-xl border border-white/[0.08] bg-[#141b29] hover:bg-[#192234] hover:border-amber-500/40 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.8),0_0_15px_rgba(229,160,13,0.15)] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Visual Header / Poster Banner */}
      <div className={`relative h-40 w-full bg-gradient-to-b ${gradient} p-4 flex flex-col justify-between overflow-hidden border-b border-white/[0.05]`}>
        {/* Subtle background decorative graphic */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-white select-none pointer-events-none">
          {item.section === 'film' && <Film className="w-36 h-36" />}
          {item.section === 'serie_tv' && <Tv className="w-36 h-36" />}
          {item.section === 'anime' && <Sparkles className="w-36 h-36" />}
          {item.section === 'cartoon' && <Smile className="w-36 h-36" />}
        </div>

        {/* Top Badges Row */}
        <div className="relative z-10 flex items-center justify-between gap-1.5">
          <SectionBadge section={item.section} />
          <ResolutionBadge resolution={item.risoluzione} />
        </div>

        {/* Year and Series Specs pill */}
        <div className="relative z-10 flex items-center justify-between">
          {item.anno ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-black/60 backdrop-blur-sm text-slate-200 border border-white/[0.1]">
              {item.anno}
            </span>
          ) : <span />}

          {isSeries && item.numero_stagioni > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 backdrop-blur-sm text-amber-300 border border-amber-500/30">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>{item.numero_stagioni} {item.numero_stagioni === 1 ? 'Stagione' : 'Stagioni'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div>
          {/* Title */}
          <h3
            className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug"
            title={item.titolo}
          >
            {item.titolo}
          </h3>

          {/* Original Title if present and different */}
          {item.titolo_originale && item.titolo_originale !== item.titolo && (
            <p className="text-xs text-slate-400 italic line-clamp-1 mt-0.5">
              {item.titolo_originale}
            </p>
          )}

          {/* Genres Chips */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.generi.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.05]"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis preview */}
          {item.trama && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-2.5 leading-relaxed font-sans">
              {item.trama}
            </p>
          )}
        </div>

        {/* Technical Footer Row */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
          {/* Duration & Size info */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {isSeries
                  ? `${item.numero_episodi} ep (${formatDuration(item.durata_min)}/ep)`
                  : formatDuration(item.durata_min)}
              </span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatStorage(item.dimensione_gb)}</span>
            </div>
          </div>

          {/* Codecs & Detail Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 overflow-hidden">
              <CodecBadge codec={item.codec_video} type="video" />
              <CodecBadge codec={item.codec_audio} type="audio" />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                title="Dettagli tecnici"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 border border-white/[0.06] hover:border-amber-500/30 transition-all text-xs"
              >
                <Info className="w-3 h-3" />
                <span className="text-[10px] font-medium">Dettagli</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
