import { useState, useEffect } from 'react';
import {
  RawCatalogData,
  UnifiedMediaItem,
  CatalogStats,
  MediaSection,
  RawFilmItem,
  RawSeriesItem
} from '../types/catalog';
import { classifyGenres } from '../utils/genreClassifier';

export interface UseCatalogDataResult {
  items: UnifiedMediaItem[];
  stats: CatalogStats | null;
  isLoading: boolean;
  error: string | null;
  loadingStep: string;
}

function extractDirector(item: any): string {
  if (typeof item.regista === 'string') return item.regista.trim();
  if (Array.isArray(item.directors) && item.directors.length > 0) {
    const d = item.directors[0];
    return (typeof d === 'string' ? d : d?.tag || d?.name || '').trim();
  }
  if (typeof item.director === 'string') return item.director.trim();
  if (typeof item.director === 'object' && item.director) return (item.director.tag || item.director.name || '').trim();
  return '';
}

function extractActors(item: any): string[] {
  const rawList = Array.isArray(item.attori)
    ? item.attori
    : Array.isArray(item.roles)
    ? item.roles
    : Array.isArray(item.cast)
    ? item.cast
    : [];

  return rawList
    .slice(0, 5)
    .map((a: any) => (typeof a === 'string' ? a : a?.tag || a?.name || '').trim())
    .filter(Boolean);
}

export function useCatalogData(): UseCatalogDataResult {
  const [items, setItems] = useState<UnifiedMediaItem[]>([]);
  const [stats, setStats] = useState<CatalogStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('Avvio connessione...');

  useEffect(() => {
    let isCancelled = false;

    async function loadCatalog() {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingStep('Caricamento catalogo multimediale (30 MB)...');

        const baseUrl = import.meta.env.BASE_URL || './';
        const dataUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/catalog_data.json`;
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`Errore HTTP ${response.status}: Impossibile caricare il catalogo.`);
        }

        setLoadingStep('Elaborazione e parsing JSON...');
        const rawData: RawCatalogData = await response.json();

        if (isCancelled) return;

        setLoadingStep('Indicizzazione e normalizzazione metadati...');

        const unifiedList: UnifiedMediaItem[] = [];
        let totalStorageGb = 0;
        let totalEpisodesCount = 0;

        // 1. Process Films
        const films = rawData.catalog.film || [];
        films.forEach((film: RawFilmItem) => {
          const size = film.dimensione_gb || 0;
          totalStorageGb += size;

          const genres = classifyGenres(film.titolo, film.trama || '', 'film');
          const director = extractDirector(film);
          const actors = extractActors(film);

          const tokens = [
            film.titolo,
            film.titolo_originale,
            film.anno?.toString() || '',
            film.trama,
            director,
            actors.join(' '),
            film.risoluzione,
            film.codec_video,
            film.codec_audio,
            film.tracce_audio,
            film.sottotitoli,
            film.file_path,
            genres.join(' ')
          ].filter(Boolean).join(' ').toLowerCase();

          unifiedList.push({
            id: film.id,
            section: 'film',
            titolo: film.titolo,
            titolo_originale: film.titolo_originale || '',
            anno: film.anno,
            trama: film.trama || '',
            voto: film.voto,
            generi: genres,
            regista: director,
            attori: actors,
            durata_min: film.durata_min,
            durata_totale_min: film.durata_min || 0,
            dimensione_gb: size,
            risoluzione: film.risoluzione || 'N/D',
            larghezza: film.larghezza,
            altezza: film.altezza,
            codec_video: film.codec_video || 'N/D',
            codec_audio: film.codec_audio || 'N/D',
            canali_audio: film.canali_audio,
            tracce_audio: film.tracce_audio || '',
            sottotitoli: film.sottotitoli || '',
            file_path: film.file_path || '',
            numero_stagioni: 0,
            numero_episodi: 0,
            searchTokens: tokens
          });
        });

        // 2. Process Episodic Series (serie_tv, anime, cartoon)
        const episodicSections: ('serie_tv' | 'anime' | 'cartoon')[] = ['serie_tv', 'anime', 'cartoon'];

        for (const section of episodicSections) {
          const seriesList = rawData.catalog[section] || [];

          seriesList.forEach((series: RawSeriesItem) => {
            let seriesStorage = 0;
            let seriesDuration = 0;
            let episodeCount = 0;
            let primaryFilePath = '';
            let primaryResolution = '1080p FHD';
            let primaryCodecVideo = 'H264';
            let primaryCodecAudio = 'AC3';
            let primaryChannels: number | null = null;
            let primaryWidth: number | null = null;
            let primaryHeight: number | null = null;
            const audioTracksSet = new Set<string>();
            const subsSet = new Set<string>();

            const seasons = series.stagioni || [];
            seasons.forEach((season) => {
              const episodes = season.episodi || [];
              episodeCount += episodes.length;
              totalEpisodesCount += episodes.length;

              episodes.forEach((ep) => {
                seriesStorage += ep.dimensione_gb || 0;
                seriesDuration += ep.durata_min || 0;

                if (!primaryFilePath && ep.file_path) {
                  primaryFilePath = ep.file_path;
                  primaryResolution = ep.risoluzione || primaryResolution;
                  primaryCodecVideo = ep.codec_video || primaryCodecVideo;
                  primaryCodecAudio = ep.codec_audio || primaryCodecAudio;
                  primaryChannels = ep.canali_audio;
                  primaryWidth = ep.larghezza;
                  primaryHeight = ep.altezza;
                }

                // Check if any episode has higher resolution
                if (ep.risoluzione?.includes('4K')) {
                  primaryResolution = '4K UHD';
                }

                if (ep.tracce_audio) {
                  ep.tracce_audio.split(',').forEach((t) => audioTracksSet.add(t.trim()));
                }
                if (ep.sottotitoli) {
                  ep.sottotitoli.split(',').forEach((s) => subsSet.add(s.trim()));
                }
              });
            });

            totalStorageGb += seriesStorage;

            const genres = classifyGenres(series.titolo, series.trama || '', section);
            const director = extractDirector(series);
            const actors = extractActors(series);

            const tokens = [
              series.titolo,
              series.titolo_originale,
              series.anno?.toString() || '',
              series.trama,
              director,
              actors.join(' '),
              primaryResolution,
              primaryCodecVideo,
              primaryCodecAudio,
              Array.from(audioTracksSet).join(' '),
              Array.from(subsSet).join(' '),
              primaryFilePath,
              genres.join(' ')
            ].filter(Boolean).join(' ').toLowerCase();

            unifiedList.push({
              id: series.id,
              section,
              titolo: series.titolo,
              titolo_originale: series.titolo_originale || '',
              anno: series.anno,
              trama: series.trama || '',
              voto: series.voto,
              generi: genres,
              regista: director,
              attori: actors,
              durata_min: episodeCount > 0 ? Math.round(seriesDuration / episodeCount) : 0,
              durata_totale_min: seriesDuration,
              dimensione_gb: Number(seriesStorage.toFixed(2)),
              risoluzione: primaryResolution,
              larghezza: primaryWidth,
              altezza: primaryHeight,
              codec_video: primaryCodecVideo,
              codec_audio: primaryCodecAudio,
              canali_audio: primaryChannels,
              tracce_audio: Array.from(audioTracksSet).slice(0, 5).join(', '),
              sottotitoli: Array.from(subsSet).slice(0, 5).join(', '),
              file_path: primaryFilePath,
              numero_stagioni: seasons.length,
              numero_episodi: episodeCount,
              stagioni: seasons,
              searchTokens: tokens
            });
          });
        }

        const calculatedStats: CatalogStats = {
          totalTitles: unifiedList.length,
          totalFilms: films.length,
          totalSeries: (rawData.catalog.serie_tv || []).length,
          totalAnime: (rawData.catalog.anime || []).length,
          totalCartoons: (rawData.catalog.cartoon || []).length,
          totalEpisodes: totalEpisodesCount,
          totalStorageGb: Number(totalStorageGb.toFixed(2)),
          lastUpdatedDisplay: rawData.metadata?.last_updated_display || 'Oggi'
        };

        if (!isCancelled) {
          setItems(unifiedList);
          setStats(calculatedStats);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error loading catalog data:', err);
          setError(err instanceof Error ? err.message : 'Errore imprevisto nel caricamento del catalogo');
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    items,
    stats,
    isLoading,
    error,
    loadingStep
  };
}
