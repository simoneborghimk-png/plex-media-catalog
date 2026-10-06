import { useState, useMemo, useCallback } from 'react';
import {
  UnifiedMediaItem,
  FilterState,
  MediaSection,
  SortField,
  SortDirection,
  ViewMode
} from '../types/catalog';
import { useDebounce } from './useDebounce';

const DEFAULT_YEAR_MIN = 1930;
const DEFAULT_YEAR_MAX = 2026;
const DEFAULT_ITEMS_PER_PAGE = 100;

export interface UseCatalogFilterResult {
  filters: FilterState;
  viewMode: ViewMode;
  filteredItems: UnifiedMediaItem[];
  paginatedItems: UnifiedMediaItem[];
  totalPages: number;
  totalFilteredCount: number;
  facetCounts: {
    sections: Record<MediaSection, number>;
    genres: Record<string, number>;
    resolutions: Record<string, number>;
    directors: Record<string, number>;
    actors: Record<string, number>;
    videoCodecs: Record<string, number>;
    audioCodecs: Record<string, number>;
  };
  isFiltered: boolean;
  setSearchQuery: (query: string) => void;
  toggleSection: (section: MediaSection) => void;
  setAllSections: () => void;
  toggleGenre: (genre: string) => void;
  clearGenres: () => void;
  toggleResolution: (res: string) => void;
  toggleDirector: (director: string) => void;
  clearDirectors: () => void;
  toggleActor: (actor: string) => void;
  clearActors: () => void;
  toggleVideoCodec: (codec: string) => void;
  toggleAudioCodec: (codec: string) => void;
  setYearRange: (min: number, max: number) => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilters: () => void;
}

export function useCatalogFilter(items: UnifiedMediaItem[]): UseCatalogFilterResult {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    sections: [],
    genres: [],
    resolutions: [],
    directors: [],
    actors: [],
    videoCodecs: [],
    audioCodecs: [],
    yearMin: DEFAULT_YEAR_MIN,
    yearMax: DEFAULT_YEAR_MAX,
    sortBy: 'titolo',
    sortDirection: 'asc',
    page: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE
  });

  const debouncedSearchQuery = useDebounce(filters.searchQuery.trim().toLowerCase(), 180);

  // Compute Facet Counts dynamically across all items or section-filtered items
  const facetCounts = useMemo(() => {
    const sectionCounts: Record<MediaSection, number> = {
      film: 0,
      serie_tv: 0,
      anime: 0,
      cartoon: 0
    };
    const genreCounts: Record<string, number> = {};
    const resolutionCounts: Record<string, number> = {};
    const directorCounts: Record<string, number> = {};
    const actorCounts: Record<string, number> = {};
    const videoCodecCounts: Record<string, number> = {};
    const audioCodecCounts: Record<string, number> = {};

    items.forEach((item) => {
      // Section count
      if (item.section in sectionCounts) {
        sectionCounts[item.section]++;
      }

      // Genre counts
      item.generi.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });

      // Director count
      if (item.regista && item.regista.trim()) {
        const d = item.regista.trim();
        directorCounts[d] = (directorCounts[d] || 0) + 1;
      }

      // Actor counts (top 5)
      item.attori.forEach((a) => {
        const act = a?.trim();
        if (act) {
          actorCounts[act] = (actorCounts[act] || 0) + 1;
        }
      });

      // Resolution tier count
      let resTier = 'Altro / SD';
      if (item.risoluzione.includes('4K') || item.risoluzione.includes('UHD')) resTier = '4K UHD';
      else if (item.risoluzione.includes('1080') || item.risoluzione.includes('FHD')) resTier = '1080p FHD';
      else if (item.risoluzione.includes('720') || item.risoluzione.includes('HD')) resTier = '720p HD';
      resolutionCounts[resTier] = (resolutionCounts[resTier] || 0) + 1;

      // Video Codec count
      const vc = item.codec_video?.toUpperCase() || 'N/D';
      videoCodecCounts[vc] = (videoCodecCounts[vc] || 0) + 1;

      // Audio Codec count
      const ac = item.codec_audio?.toUpperCase() || 'N/D';
      audioCodecCounts[ac] = (audioCodecCounts[ac] || 0) + 1;
    });

    return {
      sections: sectionCounts,
      genres: genreCounts,
      resolutions: resolutionCounts,
      directors: directorCounts,
      actors: actorCounts,
      videoCodecs: videoCodecCounts,
      audioCodecs: audioCodecCounts
    };
  }, [items]);

  // Main Filter Engine
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Text Search
      if (debouncedSearchQuery) {
        const queryTerms = debouncedSearchQuery.split(/\s+/).filter(Boolean);
        const hasAllTerms = queryTerms.every((term) => item.searchTokens.includes(term));
        if (!hasAllTerms) return false;
      }

      // 2. Section Filter
      if (filters.sections.length > 0) {
        if (!filters.sections.includes(item.section)) {
          return false;
        }
      }

      // 3. Genre Filter
      if (filters.genres.length > 0) {
        const hasAnyGenre = filters.genres.some((g) => item.generi.includes(g));
        if (!hasAnyGenre) return false;
      }

      // 4. Resolution Filter
      if (filters.resolutions.length > 0) {
        const res = item.risoluzione.toUpperCase();
        const matchesResolution = filters.resolutions.some((r) => {
          if (r === '4K UHD') return res.includes('4K') || res.includes('UHD');
          if (r === '1080p FHD') return res.includes('1080') || res.includes('FHD');
          if (r === '720p HD') return res.includes('720') || res.includes('HD');
          if (r === 'Altro / SD') return !res.includes('1080') && !res.includes('720') && !res.includes('4K');
          return res.includes(r.toUpperCase());
        });
        if (!matchesResolution) return false;
      }

      // 5. Director Filter
      if (filters.directors.length > 0) {
        if (!item.regista || !filters.directors.includes(item.regista.trim())) {
          return false;
        }
      }

      // 6. Actor Filter
      if (filters.actors.length > 0) {
        const hasMatchingActor = filters.actors.some((act) => item.attori.includes(act));
        if (!hasMatchingActor) {
          return false;
        }
      }

      // 7. Year Range
      if (item.anno !== null && item.anno !== undefined) {
        if (item.anno < filters.yearMin || item.anno > filters.yearMax) {
          return false;
        }
      }

      // 8. Video Codec
      if (filters.videoCodecs.length > 0) {
        if (!filters.videoCodecs.includes(item.codec_video?.toUpperCase())) {
          return false;
        }
      }

      // 9. Audio Codec
      if (filters.audioCodecs.length > 0) {
        if (!filters.audioCodecs.includes(item.codec_audio?.toUpperCase())) {
          return false;
        }
      }

      return true;
    });
  }, [items, debouncedSearchQuery, filters.sections, filters.genres, filters.resolutions, filters.directors, filters.actors, filters.yearMin, filters.yearMax, filters.videoCodecs, filters.audioCodecs]);

  // Sort Engine
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    const { sortBy, sortDirection } = filters;
    const modifier = sortDirection === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      let diff = 0;

      if (sortBy === 'titolo') {
        diff = modifier * a.titolo.localeCompare(b.titolo, 'it', { sensitivity: 'base' });
      } else if (sortBy === 'anno') {
        const yearA = a.anno ?? 0;
        const yearB = b.anno ?? 0;
        diff = modifier * (yearA - yearB);
      } else if (sortBy === 'dimensione_gb') {
        diff = modifier * ((a.dimensione_gb || 0) - (b.dimensione_gb || 0));
      } else if (sortBy === 'durata_min') {
        diff = modifier * ((a.durata_totale_min || 0) - (b.durata_totale_min || 0));
      } else if (sortBy === 'voto') {
        const voteA = a.voto ?? -1;
        const voteB = b.voto ?? -1;
        diff = modifier * (voteA - voteB);
      } else if (sortBy === 'regista') {
        const regA = a.regista || '';
        const regB = b.regista || '';
        if (!regA && !regB) diff = 0;
        else if (!regA) diff = 1;
        else if (!regB) diff = -1;
        else diff = modifier * regA.localeCompare(regB, 'it', { sensitivity: 'base' });
      }

      // Tie-breaker secondario: se parità sul campo scelto, ordina per titolo (nella stessa direzione)
      if (diff === 0 && sortBy !== 'titolo') {
        diff = modifier * a.titolo.localeCompare(b.titolo, 'it', { sensitivity: 'base' });
      }

      // Tie-breaker terziario: per titoli identici (es. edizioni multiple), differenzia per storage o uniqueKey
      if (diff === 0) {
        const sizeDiff = (b.dimensione_gb || 0) - (a.dimensione_gb || 0);
        diff = sizeDiff !== 0 ? sizeDiff : (a.uniqueKey || '').localeCompare(b.uniqueKey || '');
      }

      return diff;
    });

    return list;
  }, [filteredItems, filters.sortBy, filters.sortDirection]);

  // Pagination Engine
  const totalFilteredCount = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / filters.itemsPerPage));

  const paginatedItems = useMemo(() => {
    const currentPage = Math.min(filters.page, totalPages);
    const startIdx = (currentPage - 1) * filters.itemsPerPage;
    return sortedItems.slice(startIdx, startIdx + filters.itemsPerPage);
  }, [sortedItems, filters.page, filters.itemsPerPage, totalPages]);

  // Check if any filter is active
  const isFiltered = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.sections.length > 0 ||
      filters.genres.length > 0 ||
      filters.resolutions.length > 0 ||
      filters.directors.length > 0 ||
      filters.actors.length > 0 ||
      filters.videoCodecs.length > 0 ||
      filters.audioCodecs.length > 0 ||
      filters.yearMin > DEFAULT_YEAR_MIN ||
      filters.yearMax < DEFAULT_YEAR_MAX
    );
  }, [filters]);

  // Handlers
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query, page: 1 }));
  }, []);

  const toggleSection = useCallback((section: MediaSection) => {
    setFilters((prev) => {
      const exists = prev.sections.includes(section);
      const newSections = exists
        ? prev.sections.filter((s) => s !== section)
        : [...prev.sections, section];
      return { ...prev, sections: newSections, page: 1 };
    });
  }, []);

  const setAllSections = useCallback(() => {
    setFilters((prev) => ({ ...prev, sections: [], page: 1 }));
  }, []);

  const toggleGenre = useCallback((genre: string) => {
    setFilters((prev) => {
      const exists = prev.genres.includes(genre);
      const newGenres = exists
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: newGenres, page: 1 };
    });
  }, []);

  const clearGenres = useCallback(() => {
    setFilters((prev) => ({ ...prev, genres: [], page: 1 }));
  }, []);

  const toggleResolution = useCallback((res: string) => {
    setFilters((prev) => {
      const exists = prev.resolutions.includes(res);
      const newResolutions = exists
        ? prev.resolutions.filter((r) => r !== res)
        : [...prev.resolutions, res];
      return { ...prev, resolutions: newResolutions, page: 1 };
    });
  }, []);

  const toggleDirector = useCallback((director: string) => {
    setFilters((prev) => {
      const exists = prev.directors.includes(director);
      const newDirs = exists
        ? prev.directors.filter((d) => d !== director)
        : [...prev.directors, director];
      return { ...prev, directors: newDirs, page: 1 };
    });
  }, []);

  const clearDirectors = useCallback(() => {
    setFilters((prev) => ({ ...prev, directors: [], page: 1 }));
  }, []);

  const toggleActor = useCallback((actor: string) => {
    setFilters((prev) => {
      const exists = prev.actors.includes(actor);
      const newActors = exists
        ? prev.actors.filter((a) => a !== actor)
        : [...prev.actors, actor];
      return { ...prev, actors: newActors, page: 1 };
    });
  }, []);

  const clearActors = useCallback(() => {
    setFilters((prev) => ({ ...prev, actors: [], page: 1 }));
  }, []);

  const toggleVideoCodec = useCallback((codec: string) => {
    setFilters((prev) => {
      const exists = prev.videoCodecs.includes(codec);
      const next = exists
        ? prev.videoCodecs.filter((c) => c !== codec)
        : [...prev.videoCodecs, codec];
      return { ...prev, videoCodecs: next, page: 1 };
    });
  }, []);

  const toggleAudioCodec = useCallback((codec: string) => {
    setFilters((prev) => {
      const exists = prev.audioCodecs.includes(codec);
      const next = exists
        ? prev.audioCodecs.filter((c) => c !== codec)
        : [...prev.audioCodecs, codec];
      return { ...prev, audioCodecs: next, page: 1 };
    });
  }, []);

  const setYearRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, yearMin: min, yearMax: max, page: 1 }));
  }, []);

  const setSort = useCallback((field: SortField, direction?: SortDirection) => {
    setFilters((prev) => {
      let nextDir = direction;
      if (!nextDir) {
        nextDir = prev.sortBy === field ? (prev.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
      }
      return { ...prev, sortBy: field, sortDirection: nextDir, page: 1 };
    });
  }, []);

  const setPage = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, newPage) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setItemsPerPage = useCallback((count: number) => {
    setFilters((prev) => ({ ...prev, itemsPerPage: count, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
      sections: [],
      genres: [],
      resolutions: [],
      directors: [],
      actors: [],
      videoCodecs: [],
      audioCodecs: [],
      yearMin: DEFAULT_YEAR_MIN,
      yearMax: DEFAULT_YEAR_MAX,
      page: 1
    }));
  }, []);

  return {
    filters,
    viewMode,
    filteredItems: sortedItems,
    paginatedItems,
    totalPages,
    totalFilteredCount,
    facetCounts,
    isFiltered,
    setSearchQuery,
    toggleSection,
    setAllSections,
    toggleGenre,
    clearGenres,
    toggleResolution,
    toggleDirector,
    clearDirectors,
    toggleActor,
    clearActors,
    toggleVideoCodec,
    toggleAudioCodec,
    setYearRange,
    setSort,
    setPage,
    setItemsPerPage,
    setViewMode,
    resetFilters
  };
}
