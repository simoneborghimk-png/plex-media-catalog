import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronRight,
  Clock,
  HardDrive
} from 'lucide-react';
import { RawSeasonItem, RawEpisodeItem } from '../../types/catalog';
import { ResolutionBadge, CodecBadge } from '../common/Badge';
import { formatDuration, formatStorage, formatChannels } from '../../utils/formatters';

interface SeasonAccordionProps {
  seasons: RawSeasonItem[];
}

export const SeasonAccordion: React.FC<SeasonAccordionProps> = ({ seasons }) => {
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const [expandedEpId, setExpandedEpId] = useState<number | null>(null);

  if (!seasons || seasons.length === 0) return null;

  const currentSeason = seasons[activeSeasonIdx] || seasons[0];
  const episodes = currentSeason.episodi || [];

  const toggleEpisodeExpand = (id: number) => {
    setExpandedEpId(expandedEpId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Seasons Tab Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-white/[0.08]">
        {seasons.map((season, idx) => {
          const isSelected = idx === activeSeasonIdx;
          const label = season.stagione === 0 ? 'Speciali' : `Stagione ${season.stagione}`;
          const epCount = season.episodi?.length || 0;

          return (
            <button
              key={season.id}
              onClick={() => setActiveSeasonIdx(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.05]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-black/20 text-black' : 'bg-white/[0.08] text-slate-400'
              }`}>
                {epCount} ep
              </span>
            </button>
          );
        })}
      </div>

      {/* Episodes List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            {currentSeason.titolo_stagione || `Stagione ${currentSeason.stagione}`} —{' '}
            <span className="font-mono text-white font-semibold">{episodes.length}</span> episodi
          </span>
          <span className="text-[11px] text-slate-500">
            Fai clic su un episodio per espandere
          </span>
        </div>

        <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#0c101a] overflow-hidden">
          {episodes.map((ep) => {
            const isExpanded = expandedEpId === ep.id;

            return (
              <div
                key={ep.id}
                className="transition-colors hover:bg-white/[0.02]"
              >
                {/* Episode Row Header */}
                <div
                  onClick={() => toggleEpisodeExpand(ep.id)}
                  className="p-3 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {ep.numero}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate hover:text-amber-400">
                        {ep.titolo || `Episodio ${ep.numero}`}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                        {ep.durata_min && <span>{formatDuration(ep.durata_min)}</span>}
                        {ep.dimensione_gb && <span>• {formatStorage(ep.dimensione_gb)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ResolutionBadge resolution={ep.risoluzione} size="sm" />
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-white/[0.01] border-t border-white/[0.04] space-y-3 text-xs">
                    {ep.trama && (
                      <p className="text-slate-300 leading-relaxed text-xs">
                        {ep.trama}
                      </p>
                    )}

                    {/* Technical details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.04] text-[11px]">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-500 block">Video</span>
                        <div className="flex items-center gap-1 mt-0.5 font-mono text-slate-200">
                          <CodecBadge codec={ep.codec_video} type="video" />
                          <span>{ep.larghezza}x{ep.altezza}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-500 block">Audio</span>
                        <div className="flex items-center gap-1 mt-0.5 font-mono text-slate-200">
                          <CodecBadge codec={ep.codec_audio} type="audio" />
                          <span>{formatChannels(ep.canali_audio)}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded-lg border border-white/[0.04] col-span-2">
                        <span className="text-slate-500 block">Tracce Audio</span>
                        <span className="text-slate-300 truncate block mt-0.5" title={ep.tracce_audio}>
                          {ep.tracce_audio || 'N/D'}
                        </span>
                      </div>
                    </div>

                    {/* Sottotitoli */}
                    {ep.sottotitoli && (
                      <div className="text-[11px] text-slate-400">
                        <span className="text-slate-500">Sottotitoli:</span> {ep.sottotitoli}
                      </div>
                    )}


                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
