import React, { useEffect, useState } from 'react';
import {
  X,
  Copy,
  Check,
  Film,
  HardDrive,
  Clock,
  Layers,
  Monitor,
  Volume2,
  FileText,
  FolderOpen
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
import { copyToClipboard } from '../../utils/copyToClipboard';

interface MediaDetailDrawerProps {
  item: UnifiedMediaItem | null;
  onClose: () => void;
}

export const MediaDetailDrawer: React.FC<MediaDetailDrawerProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleCopyPath = async () => {
    if (!item.file_path) return;
    const ok = await copyToClipboard(item.file_path);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all border border-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <SectionBadge section={item.section} size="md" />
              <ResolutionBadge resolution={item.risoluzione} size="md" />
              {item.anno && (
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white/[0.06] text-slate-200 border border-white/[0.08]">
                  {item.anno}
                </span>
              )}
              {isSeries && item.numero_stagioni > 0 && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.numero_stagioni} {item.numero_stagioni === 1 ? 'Stagione' : 'Stagioni'}</span>
                  <span>({item.numero_episodi} episodi)</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {item.titolo}
            </h2>

            {item.titolo_originale && item.titolo_originale !== item.titolo && (
              <p className="text-sm text-slate-400 italic mt-1">
                Titolo originale: {item.titolo_originale}
              </p>
            )}

            {/* Quick Metrics Header */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  {isSeries
                    ? `Totale: ${formatDuration(item.durata_totale_min)}`
                    : formatDuration(item.durata_min)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span>Storage: {formatStorage(item.dimensione_gb)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-emerald-400" />
                <span>ID Plex: #{item.id}</span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Genres */}
            {item.generi.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Generi:</span>
                {item.generi.map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-200 border border-white/[0.08] font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {item.trama && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sinossi / Trama
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                  {item.trama}
                </p>
              </div>
            )}

            {/* Technical Specifications Panel */}
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

            {/* Storage File Path Box with Copy Button */}
            {item.file_path && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-amber-400" />
                  Percorso File su Disco Locale
                </h4>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/60 border border-white/[0.08]">
                  <code className="text-xs font-mono text-amber-300 break-all select-all flex-1">
                    {item.file_path}
                  </code>

                  <button
                    onClick={handleCopyPath}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      copied
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(229,160,13,0.3)]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Percorso Copiato!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copia Percorso</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Episodic Explorer for TV Series, Anime, Cartoon */}
            {isSeries && item.stagioni && item.stagioni.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Esplora Stagioni ed Episodi ({item.numero_episodi} totali)
                </h4>
                <SeasonAccordion seasons={item.stagioni} />
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
