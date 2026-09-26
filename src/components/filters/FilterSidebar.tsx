import React, { useState, useMemo } from 'react';
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
  ChevronUp,
  Clapperboard,
  User,
  Users
} from 'lucide-react';
import { FilterState } from '../../types/catalog';

interface FilterSidebarProps {
  filters: FilterState;
  facetCounts: {
    genres: Record<string, number>;
    resolutions: Record<string, number>;
    directors: Record<string, number>;
    actors: Record<string, number>;
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
  onToggleDirector: (director: string) => void;
  onClearDirectors: () => void;
  onToggleActor: (actor: string) => void;
  onClearActors: () => void;
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
  onToggleDirector,
  onClearDirectors,
  onToggleActor,
  onClearActors,
  onToggleVideoCodec,
  onToggleAudioCodec,
  onYearRangeChange,
  onResetFilters,
  isMobileOpen,
  onCloseMobile
}) => {
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [directorSearch, setDirectorSearch] = useState('');
  const [showAllDirectors, setShowAllDirectors] = useState(false);
  const [actorSearch, setActorSearch] = useState('');
  const [showAllActors, setShowAllActors] = useState(false);

  // Sorted list of genres by count descending from Plex data
  const sortedGenres = useMemo(() => {
    return Object.entries(facetCounts.genres || {})
      .filter(([g, count]) => g && g.trim().length > 0 && count > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [facetCounts.genres]);

  const displayedGenres = useMemo(() => {
    return showAllGenres ? sortedGenres : sortedGenres.slice(0, 10);
  }, [sortedGenres, showAllGenres]);

  // Sorted list of directors by count descending
  const sortedDirectors = useMemo(() => {
    return Object.entries(facetCounts.directors || {})
      .filter(([d]) => d && d.trim().length > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [facetCounts.directors]);

  // Filtered directors matching directorSearch
  const displayedDirectors = useMemo(() => {
    let list = sortedDirectors;
    if (directorSearch.trim()) {
      const q = directorSearch.trim().toLowerCase();
      list = list.filter(([d]) => d.toLowerCase().includes(q));
    }
    return showAllDirectors || directorSearch.trim() ? list : list.slice(0, 8);
  }, [sortedDirectors, directorSearch, showAllDirectors]);

  // Sorted list of actors by count descending
  const sortedActors = useMemo(() => {
    return Object.entries(facetCounts.actors || {})
      .filter(([a]) => a && a.trim().length > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [facetCounts.actors]);

  // Filtered actors matching actorSearch
  const displayedActors = useMemo(() => {
    let list = sortedActors;
    if (actorSearch.trim()) {
      const q = actorSearch.trim().toLowerCase();
      list = list.filter(([a]) => a.toLowerCase().includes(q));
    }
    return showAllActors || actorSearch.trim() ? list : list.slice(0, 8);
  }, [sortedActors, actorSearch, showAllActors]);

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
          {displayedGenres.map(([genre, count]) => {
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
        {sortedGenres.length > 10 && (
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
                <ChevronDown className="w-3 h-3" /> Mostra tutti i generi ({sortedGenres.length})
              </>
            )}
          </button>
        )}
      </div>

      {/* Director Filter */}
      <div className="space-y-2 pt-2 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
            Regia / Regista
          </label>
          {filters.directors.length > 0 && (
            <button
              onClick={onClearDirectors}
              className="text-[11px] text-slate-400 hover:text-amber-400"
            >
              Deseleziona ({filters.directors.length})
            </button>
          )}
        </div>

        {/* Selected Directors Chips */}
        {filters.directors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {filters.directors.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-medium"
              >
                <span className="truncate max-w-[130px]">{d}</span>
                <button
                  onClick={() => onToggleDirector(d)}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search input for directors */}
        {sortedDirectors.length > 5 && (
          <div className="relative">
            <input
              type="text"
              value={directorSearch}
              onChange={(e) => setDirectorSearch(e.target.value)}
              placeholder="Filtra registi..."
              className="w-full pl-7 pr-6 py-1 bg-slate-900/70 border border-white/[0.08] rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
            {directorSearch && (
              <button
                onClick={() => setDirectorSearch('')}
                className="absolute right-1.5 top-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Directors List */}
        {sortedDirectors.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {displayedDirectors.map(([director, count]) => {
                const isSelected = filters.directors.includes(director);

                return (
                  <button
                    key={director}
                    onClick={() => onToggleDirector(director)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(229,160,13,0.2)]'
                        : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{director}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {!directorSearch && sortedDirectors.length > 8 && (
              <button
                onClick={() => setShowAllDirectors(!showAllDirectors)}
                className="text-xs text-amber-400/80 hover:text-amber-300 flex items-center gap-1 pt-0.5"
              >
                {showAllDirectors ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Mostra meno registi
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> Mostra tutti i registi ({sortedDirectors.length})
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-500 italic py-0.5">
            Nessun metadato registi nel catalogo
          </p>
        )}
      </div>

      {/* Actor Filter */}
      <div className="space-y-2 pt-2 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Attori Principali
          </label>
          {filters.actors.length > 0 && (
            <button
              onClick={onClearActors}
              className="text-[11px] text-slate-400 hover:text-sky-400"
            >
              Deseleziona ({filters.actors.length})
            </button>
          )}
        </div>

        {/* Selected Actors Chips */}
        {filters.actors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {filters.actors.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/50 text-xs font-medium"
              >
                <span className="truncate max-w-[130px]">{a}</span>
                <button
                  onClick={() => onToggleActor(a)}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search input for actors */}
        {sortedActors.length > 5 && (
          <div className="relative">
            <input
              type="text"
              value={actorSearch}
              onChange={(e) => setActorSearch(e.target.value)}
              placeholder="Filtra attori..."
              className="w-full pl-7 pr-6 py-1 bg-slate-900/70 border border-white/[0.08] rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
            {actorSearch && (
              <button
                onClick={() => setActorSearch('')}
                className="absolute right-1.5 top-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Actors List */}
        {sortedActors.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {displayedActors.map(([actor, count]) => {
                const isSelected = filters.actors.includes(actor);

                return (
                  <button
                    key={actor}
                    onClick={() => onToggleActor(actor)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                        : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{actor}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {!actorSearch && sortedActors.length > 8 && (
              <button
                onClick={() => setShowAllActors(!showAllActors)}
                className="text-xs text-sky-400/80 hover:text-sky-300 flex items-center gap-1 pt-0.5"
              >
                {showAllActors ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Mostra meno attori
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> Mostra tutti gli attori ({sortedActors.length})
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-500 italic py-0.5">
            Nessun metadato attori nel catalogo
          </p>
        )}
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
