import React, { useState } from 'react';
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Film,
  Calendar,
  Monitor,
  Tag,
  Video,
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FilterState } from '../../types/catalog';
import { AVAILABLE_GENRES } from '../../utils/genreClassifier';

interface FilterSidebarProps {
  filters: FilterState;
  facetCounts: {
    genres: Record<string, number>;
    resolutions: Record<string, number>;
    videoCodecs: Record<string, number>;
    audioCodecs: Record<string, number>;
  };
  totalFilteredCount: number;
  totalCatalogCount: number;
  isFiltered: boolean;
  onSearchChange: (query: string) => void;
  onToggleResolution: (res: string) => void;
  onToggleGenre: (genre: string) => void;
  onClearGenres: () => void;
  onToggleVideoCodec: (codec: string) => void;
  onToggleAudioCodec: (codec: string) => void;
  onYearRangeChange: (min: number, max: number) => void;
  onResetFilters: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const RESOLUTION_OPTIONS = ['4K UHD', '1080p FHD', '720p HD', 'Altro / SD'];
const VIDEO_CODECS = ['HEVC', 'H264', 'VC1', 'MPEG4'];
const AUDIO_CODECS = ['DCA', 'AC3', 'EAC3', 'AAC', 'FLAC', 'TRUEHD'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  facetCounts,
  totalFilteredCount,
  totalCatalogCount,
  isFiltered,
  onSearchChange,
  onToggleResolution,
  onToggleGenre,
  onClearGenres,
  onToggleVideoCodec,
  onToggleAudioCodec,
  onYearRangeChange,
  onResetFilters,
  isMobileOpen,
  onCloseMobile
}) => {
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const displayedGenres = showAllGenres ? AVAILABLE_GENRES : AVAILABLE_GENRES.slice(0, 8);

  const content = (
    <div className="flex flex-col gap-6 p-4 sm:p-5">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Filtri Catalogo
          </h2>
        </div>
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reimposta</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Cerca nel Catalogo
          </span>
          {filters.searchQuery && (
            <span className="text-[11px] text-amber-400 font-mono">
              Attivo
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca per titolo, trama, codec..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-white/[0.1] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          {filters.searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter summary counter */}
      <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs flex items-center justify-between">
        <span className="text-slate-400">Titoli corrispondenti:</span>
        <span className="font-mono font-bold text-amber-400">
          {totalFilteredCount.toLocaleString('it-IT')} <span className="text-slate-500 font-normal">/ {totalCatalogCount.toLocaleString('it-IT')}</span>
        </span>
      </div>

      {/* Resolution Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-sky-400" />
          Risoluzione Video
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {RESOLUTION_OPTIONS.map((res) => {
            const count = facetCounts.resolutions[res] || 0;
            const isSelected = filters.resolutions.includes(res);

            return (
              <button
                key={res}
                onClick={() => onToggleResolution(res)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                    : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span className="truncate">{res}</span>
                <span className="text-[10px] font-mono text-slate-400 ml-1">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Range Filter */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Anno di Uscita
          </label>
          <span className="text-xs font-mono font-semibold text-amber-400">
            {filters.yearMin} – {filters.yearMax}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1930}
              max={2026}
              value={filters.yearMin}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), filters.yearMax);
                onYearRangeChange(val, filters.yearMax);
              }}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <input
              type="range"
              min={1930}
              max={2026}
              value={filters.yearMax}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), filters.yearMin);
                onYearRangeChange(filters.yearMin, val);
              }}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>1930</span>
            <span>2026</span>
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            Generi e Categorie
          </label>
          {filters.genres.length > 0 && (
            <button
              onClick={onClearGenres}
              className="text-[11px] text-slate-400 hover:text-amber-400"
            >
              Deseleziona
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {displayedGenres.map((genre) => {
            const count = facetCounts.genres[genre] || 0;
            const isSelected = filters.genres.includes(genre);

            return (
              <button
                key={genre}
                onClick={() => onToggleGenre(genre)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(229,160,13,0.2)]'
                    : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span>{genre}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowAllGenres(!showAllGenres)}
          className="text-xs text-amber-400/80 hover:text-amber-300 flex items-center gap-1 pt-1"
        >
          {showAllGenres ? (
            <>
              <ChevronUp className="w-3 h-3" /> Mostra meno generi
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Mostra tutti i generi ({AVAILABLE_GENRES.length})
            </>
          )}
        </button>
      </div>

      {/* Advanced Codec Filters Toggle */}
      <div className="pt-2 border-t border-white/[0.08]">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 py-1.5 hover:text-white"
        >
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            Specifiche Codec Audio/Video
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-3">
            {/* Video Codec */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Video className="w-3 h-3 text-indigo-400" />
                Codec Video
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {VIDEO_CODECS.map((codec) => {
                  const count = facetCounts.videoCodecs[codec] || 0;
                  const isSelected = filters.videoCodecs.includes(codec);

                  return (
                    <button
                      key={codec}
                      onClick={() => onToggleVideoCodec(codec)}
                      className={`flex items-center justify-between px-2 py-1 rounded text-xs border font-mono transition-all ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/60'
                          : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800'
                      }`}
                    >
                      <span>{codec}</span>
                      <span className="text-[10px] text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Codec */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-emerald-400" />
                Codec Audio
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {AUDIO_CODECS.map((codec) => {
                  const count = facetCounts.audioCodecs[codec] || 0;
                  const isSelected = filters.audioCodecs.includes(codec);

                  return (
                    <button
                      key={codec}
                      onClick={() => onToggleAudioCodec(codec)}
                      className={`flex items-center justify-between px-1.5 py-1 rounded text-[11px] border font-mono transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800'
                      }`}
                    >
                      <span>{codec}</span>
                      <span className="text-[9px] text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-[#0f141f]/95 border-r border-white/[0.08] min-h-[calc(100vh-120px)] sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto no-scrollbar">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#0f141f] border-l border-white/[0.1] h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <span className="font-bold text-white text-sm">Filtri</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
