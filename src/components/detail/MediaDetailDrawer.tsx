import React, { useEffect, useState } from 'react';
import {
  X,
  Film,
  Tv,
  Sparkles,
  Smile,
  HardDrive,
  Clock,
  Layers,
  Monitor,
  FileText,
  User,
  Users,
  Tag
} from 'lucide-react';
import { UnifiedMediaItem } from '../../types/catalog';
import { ResolutionBadge, SectionBadge, CodecBadge } from '../common/Badge';
import { SeasonAccordion } from './SeasonAccordion';
import {
  formatDuration,
  formatStorage,
  formatChannels,
  cleanCodec
} from '../../utils/formatters';
import { getPosterUrl } from '../../utils/poster';

interface MediaDetailDrawerProps {
  item: UnifiedMediaItem | null;
  onClose: () => void;
  onFilterByDirector?: (director: string) => void;
  onFilterByActor?: (actor: string) => void;
}

export const MediaDetailDrawer: React.FC<MediaDetailDrawerProps> = ({
  item,
  onClose,
  onFilterByDirector,
  onFilterByActor
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isSeries = item.section !== 'film';

  // Calculate Aspect Ratio if width and height exist
  const getAspectRatio = (w: number | null, h: number | null) => {
    if (!w || !h) return null;
    const ratio = (w / h).toFixed(2);
    if (ratio === '1.78') return '16:9 (1.78:1)';
    if (ratio === '2.40' || ratio === '2.39' || ratio === '2.35') return '2.39:1 Cinemascope';
    if (ratio === '1.33') return '4:3 Standard';
    return `${ratio}:1`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Sliding Container */}
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4 sm:p-6">
        <div
          className="inline-block w-full max-w-4xl text-left align-middle transition-all transform bg-[#0f1422] border border-white/[0.1] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 p-6 sm:p-8 border-b border-white/[0.08]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all border border-white/[0.08] z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Permanent Poster Cover Slot with atmospheric placeholder */}
              <div className="w-28 sm:w-36 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/[0.12] bg-[#0c101c] relative flex flex-col items-center justify-center">
                {/* Fallback Graphic (visible while loading or if missing) */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 via-slate-900/60 to-[#0a0d14] flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-2 shadow-inner">
                    {item.section === 'film' && <Film className="w-6 h-6 text-amber-400/80" />}
                    {item.section === 'serie_tv' && <Tv className="w-6 h-6 text-blue-400/80" />}
                    {item.section === 'anime' && <Sparkles className="w-6 h-6 text-rose-400/80" />}
                    {item.section === 'cartoon' && <Smile className="w-6 h-6 text-emerald-400/80" />}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
                    {item.section === 'film' ? 'Film' : item.section === 'serie_tv' ? 'Serie TV' : item.section === 'anime' ? 'Anime' : 'Cartoni'}
                  </span>
                </div>

                {/* Real WebP Poster (overlays on top when loaded) */}
                {!imgError && (
                  <img
                    src={getPosterUrl(item.id)}
                    alt={item.titolo}
                    onError={() => setImgError(true)}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                )}
              </div>

              {/* Main Info Column */}
              <div className="flex-1 min-w-0 pr-10 sm:pr-12">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  {/* Left Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <SectionBadge section={item.section} size="md" />
                    <ResolutionBadge resolution={item.risoluzione} size="md" />
                    {item.anno && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white/[0.06] text-slate-200 border border-white/[0.08]">
                        {item.anno}
                      </span>
                    )}
                  </div>

                  {/* Right Badges: Durata & Dimensione */}
                  <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.06] text-slate-200 border border-white/[0.08]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {formatDuration(isSeries ? item.durata_totale_min : item.durata_min)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.06] text-slate-200 border border-white/[0.08]">
                      <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                      <span>{formatStorage(item.dimensione_gb)}</span>
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {item.titolo}
                </h2>

                {item.titolo_originale && item.titolo_originale !== item.titolo && (
                  <p className="text-sm text-slate-400 italic mt-1">
                    Titolo originale: {item.titolo_originale}
                  </p>
                )}

                {/* Generi, Regia & Cast compresso sotto al titolo */}
                <div className="flex flex-col gap-2.5 mt-4 pt-3.5 border-t border-white/[0.08] text-xs">
                  {/* Genres */}
                  {item.generi.length > 0 && (
                    <div
                      className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scroll-smooth"
                      onWheel={(e) => {
                        if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth && e.deltaY !== 0) {
                          e.currentTarget.scrollLeft += e.deltaY;
                        }
                      }}
                    >
                      <span className="text-slate-400 font-medium mr-1 shrink-0 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        Generi:
                      </span>
                      {item.generi.map((genre) => (
                        <span
                          key={genre}
                          className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-200 border border-white/[0.08] font-medium whitespace-nowrap shrink-0"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Regia */}
                  {item.regista && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        Regia:
                      </span>
                      {onFilterByDirector ? (
                        <button
                          onClick={() => {
                            onFilterByDirector(item.regista);
                            onClose();
                          }}
                          title={`Filtra per regista: ${item.regista}`}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/25 text-xs font-semibold transition-all"
                        >
                          {item.regista}
                        </button>
                      ) : (
                        <span className="text-slate-200 font-medium">
                          {item.regista}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Cast */}
                  {item.attori && item.attori.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0 mr-0.5">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        Cast:
                      </span>
                      {item.attori.slice(0, 5).map((actor, idx) => (
                        onFilterByActor ? (
                          <button
                            key={actor + idx}
                            onClick={() => {
                              onFilterByActor(actor);
                              onClose();
                            }}
                            title={`Filtra catalogo per attore: ${actor}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-sky-500/20 text-slate-300 hover:text-sky-200 border border-white/[0.08] hover:border-sky-500/30 text-xs font-medium transition-all group shadow-sm"
                          >
                            <span>{actor}</span>
                          </button>
                        ) : (
                          <span
                            key={actor + idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08] text-xs font-medium"
                          >
                            <span>{actor}</span>
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Synopsis */}
            {item.trama && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Sinossi / Trama
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                  {item.trama}
                </p>
              </div>
            )}

            {/* Episodic Explorer for TV Series, Anime, Cartoon */}
            {isSeries && item.stagioni && item.stagioni.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>
                    Esplora Stagioni ed Episodi{' '}
                    <span className="text-amber-300/90 font-medium normal-case ml-1">
                      - {item.numero_stagioni} {item.numero_stagioni === 1 ? 'Stagione' : 'Stagioni'} ({item.numero_episodi} Episodi)
                    </span>
                  </span>
                </h4>
                <SeasonAccordion seasons={item.stagioni} />
              </div>
            )}

            {/* Technical Specifications Panel (Film only - serials have episode-level specs) */}
            {!isSeries && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-sky-400" />
                  Specifiche Tecniche Audio & Video
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Video Card */}
                  <div className="bg-[#141a29] p-4 rounded-xl border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Flusso Video</span>
                      <CodecBadge codec={item.codec_video} type="video" />
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {item.larghezza && item.altezza ? `${item.larghezza} × ${item.altezza} px` : item.risoluzione}
                    </div>
                    {getAspectRatio(item.larghezza, item.altezza) && (
                      <div className="text-xs text-slate-400">
                        Aspetto: <span className="text-slate-200 font-mono">{getAspectRatio(item.larghezza, item.altezza)}</span>
                      </div>
                    )}
                    <div className="text-xs text-slate-400">
                      Codec: <span className="text-slate-200 font-medium">{cleanCodec(item.codec_video)}</span>
                    </div>
                  </div>

                  {/* Audio Card */}
                  <div className="bg-[#141a29] p-4 rounded-xl border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Flusso Audio</span>
                      <CodecBadge codec={item.codec_audio} type="audio" />
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {formatChannels(item.canali_audio) || item.codec_audio}
                    </div>
                    <div className="text-xs text-slate-400 truncate" title={item.tracce_audio}>
                      Tracce: <span className="text-slate-200">{item.tracce_audio || 'N/D'}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Formato: <span className="text-slate-200 font-medium">{item.codec_audio}</span>
                    </div>
                  </div>

                  {/* Subtitles Card */}
                  <div className="bg-[#141a29] p-4 rounded-xl border border-white/[0.06] space-y-2 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Sottotitoli</span>
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-sm font-bold text-white">
                      {item.sottotitoli ? 'Disponibili' : 'Nessuno'}
                    </div>
                    <div className="text-xs text-slate-400 truncate" title={item.sottotitoli}>
                      Streams: <span className="text-slate-200">{item.sottotitoli || 'Nessun sottotitolo rilevato'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Footer Controls */}
          <div className="bg-[#0b0e18] px-6 py-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Premi <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-mono text-[11px]">ESC</kbd> per chiudere
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold transition-all border border-white/[0.08]"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
