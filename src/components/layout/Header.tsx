import React from 'react';
import {
  Film,
  Tv,
  Sparkles,
  Smile,
  HardDrive,
  Clock,
  Layers
} from 'lucide-react';
import { CatalogStats, MediaSection } from '../../types/catalog';
import { formatStorage } from '../../utils/formatters';

interface HeaderProps {
  stats: CatalogStats | null;
  activeSections: MediaSection[];
  onToggleSection: (section: MediaSection) => void;
  onSelectAllSections: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  activeSections,
  onToggleSection,
  onSelectAllSections
}) => {
  const isAllSelected = activeSections.length === 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0a0d14]/90 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Main Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3.5">
            {/* Plex Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_0_20px_rgba(229,160,13,0.35)]">
              <svg className="w-5 h-5 text-black fill-current ml-0.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Plex Media Catalog
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                  Locale
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Archivio multimediale e specifiche tecniche
              </p>
            </div>
          </div>

          {/* Quick Storage & Update Info */}
          {stats && (
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/[0.06]">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Storage Totale:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {formatStorage(stats.totalStorageGb)}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/[0.06]">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Aggiornato:</span>
                <span className="text-slate-300">
                  {stats.lastUpdatedDisplay}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section Tabs Quick Selector */}
        {stats && (
          <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={onSelectAllSections}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isAllSelected
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(229,160,13,0.3)]'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tutti i Media</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isAllSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/[0.08] text-slate-400'
              }`}>
                {stats.totalTitles}
              </span>
            </button>

            <button
              onClick={() => onToggleSection('film')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSections.includes('film')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(229,160,13,0.15)] font-semibold'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Film</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/[0.08] text-slate-400">
                {stats.totalFilms}
              </span>
            </button>

            <button
              onClick={() => onToggleSection('serie_tv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSections.includes('serie_tv')
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)] font-semibold'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-blue-400" />
              <span>Serie TV</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/[0.08] text-slate-400">
                {stats.totalSeries}
              </span>
            </button>

            <button
              onClick={() => onToggleSection('anime')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSections.includes('anime')
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.15)] font-semibold'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Anime</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/[0.08] text-slate-400">
                {stats.totalAnime}
              </span>
            </button>

            <button
              onClick={() => onToggleSection('cartoon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSections.includes('cartoon')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cartoni</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/[0.08] text-slate-400">
                {stats.totalCartoons}
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
