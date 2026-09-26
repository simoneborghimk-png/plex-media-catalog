export type MediaSection = 'film' | 'serie_tv' | 'anime' | 'cartoon';

export interface RawEpisodeItem {
  id: number;
  numero: number;
  titolo: string;
  trama: string;
  voto: number | null;
  durata_min: number | null;
  risoluzione: string;
  larghezza: number | null;
  altezza: number | null;
  codec_video: string;
  codec_audio: string;
  canali_audio: number | null;
  tracce_audio: string;
  sottotitoli: string;
  dimensione_gb: number | null;
  file_path: string;
}

export interface RawSeasonItem {
  id: number;
  stagione: number;
  titolo_stagione: string;
  episodi: RawEpisodeItem[];
}

export interface RawSeriesItem {
  id: number;
  titolo: string;
  titolo_originale: string;
  anno: number | null;
  trama: string;
  voto: number | null;
  generi?: string[];
  regista?: string;
  attori?: string[];
  stagioni: RawSeasonItem[];
}

export interface RawFilmItem {
  id: number;
  titolo: string;
  titolo_originale: string;
  anno: number | null;
  trama: string;
  voto: number | null;
  durata_min: number | null;
  risoluzione: string;
  larghezza: number | null;
  altezza: number | null;
  codec_video: string;
  codec_audio: string;
  canali_audio: number | null;
  tracce_audio: string;
  sottotitoli: string;
  dimensione_gb: number | null;
  file_path: string;
  generi?: string[];
  regista?: string;
  attori?: string[];
}

export interface RawCatalogMetadata {
  last_updated: string;
  last_updated_display: string;
  total_titles: number;
}

export interface RawCatalogData {
  metadata: RawCatalogMetadata;
  catalog: {
    film: RawFilmItem[];
    serie_tv: RawSeriesItem[];
    anime: RawSeriesItem[];
    cartoon: RawSeriesItem[];
  };
}

export interface UnifiedMediaItem {
  id: number;
  section: MediaSection;
  titolo: string;
  titolo_originale: string;
  anno: number | null;
  trama: string;
  voto: number | null;
  generi: string[];
  regista: string;
  attori: string[];
  
  // Normalized/Aggregated properties
  durata_min: number | null;        // Film: durata / Serie: durata media o primo ep
  durata_totale_min: number;        // Somma per serie, durata per film
  dimensione_gb: number;            // Dimensione film o storage totale serie
  risoluzione: string;              // Risoluzione primaria / max
  larghezza: number | null;
  altezza: number | null;
  codec_video: string;
  codec_audio: string;
  canali_audio: number | null;
  tracce_audio: string;
  sottotitoli: string;
  file_path: string;
  
  // Series specific
  numero_stagioni: number;
  numero_episodi: number;
  stagioni?: RawSeasonItem[];

  // Search tokens (normalized lowercase for sub-millisecond search)
  searchTokens: string;
}

export interface CatalogStats {
  totalTitles: number;
  totalFilms: number;
  totalSeries: number;
  totalAnime: number;
  totalCartoons: number;
  totalEpisodes: number;
  totalStorageGb: number;
  lastUpdatedDisplay: string;
  lastUpdatedIso?: string;
  daysSinceUpdate?: number;
  isOutdated?: boolean;
}

export type SortField = 'titolo' | 'anno' | 'dimensione_gb' | 'durata_min' | 'voto';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'table';

export interface FilterState {
  searchQuery: string;
  sections: MediaSection[];
  genres: string[];
  resolutions: string[];
  directors: string[];
  actors: string[];
  videoCodecs: string[];
  audioCodecs: string[];
  yearMin: number;
  yearMax: number;
  sortBy: SortField;
  sortDirection: SortDirection;
  page: number;
  itemsPerPage: number;
}
