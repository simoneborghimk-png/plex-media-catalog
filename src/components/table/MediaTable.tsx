import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  UnifiedMediaItem,
  SortField,
  SortDirection
} from '../../types/catalog';
import { ResolutionBadge, SectionBadge, CodecBadge } from '../common/Badge';
import { formatDuration, formatStorage } from '../../utils/formatters';
import { copyToClipboard } from '../../utils/copyToClipboard';

interface MediaTableProps {
  items: UnifiedMediaItem[];
  sortBy: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction?: SortDirection) => void;
  currentPage: number;
  totalPages: number;
  totalFilteredCount: number;
  onPageChange: (page: number) => void;
  onSelectItem: (item: UnifiedMediaItem) => void;
}

export const MediaTable: React.FC<MediaTableProps> = ({
  items,
  sortBy,
  sortDirection,
  onSortChange,
  currentPage,
  totalPages,
  totalFilteredCount,
  onPageChange,
  onSelectItem
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (e: React.MouseEvent, id: number, path: string) => {
    e.stopPropagation();
    if (!path) return;
    const ok = await copyToClipboard(path);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-amber-400 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-400 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#111622]/90 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold tracking-wider select-none">
              <th
                onClick={() => onSortChange('titolo')}
                className="group py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Titolo / Opera</span>
                  {renderSortIndicator('titolo')}
                </div>
              </th>
              <th className="py-3.5 px-3">Tipo</th>
              <th
                onClick={() => onSortChange('anno')}
                className="group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Anno</span>
                  {renderSortIndicator('anno')}
                </div>
              </th>
              <th className="py-3.5 px-3">Risoluzione</th>
              <th className="py-3.5 px-3">Video Codec</th>
              <th className="py-3.5 px-3">Audio Codec</th>
              <th
                onClick={() => onSortChange('durata_min')}
                className="group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Durata / Ep.</span>
                  {renderSortIndicator('durata_min')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('dimensione_gb')}
                className="group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Dimensione</span>
                  {renderSortIndicator('dimensione_gb')}
                </div>
              </th>
              <th className="py-3.5 px-4">Percorso File Storage</th>
              <th className="py-3.5 px-3 text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-slate-300">
            {items.map((item) => {
              const isCopied = copiedId === item.id;
              const isSeries = item.section !== 'film';

              return (
                <tr
                  key={`${item.section}-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  {/* Title & Original Title */}
                  <td className="py-3 px-4 min-w-[220px]">
                    <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.titolo}
                    </div>
                    {item.titolo_originale && item.titolo_originale !== item.titolo && (
                      <div className="text-[11px] text-slate-400 italic truncate max-w-xs">
                        {item.titolo_originale}
                      </div>
                    )}
                  </td>

                  {/* Section Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SectionBadge section={item.section} />
                  </td>

                  {/* Year */}
                  <td className="py-3 px-3 font-mono font-medium text-slate-300 whitespace-nowrap">
                    {item.anno || '—'}
                  </td>

                  {/* Resolution */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <ResolutionBadge resolution={item.risoluzione} />
                  </td>

                  {/* Video Codec */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <CodecBadge codec={item.codec_video} type="video" />
                  </td>

                  {/* Audio Codec */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <CodecBadge codec={item.codec_audio} type="audio" />
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-400">
                    {isSeries ? (
                      <span title={`${item.numero_episodi} episodi`}>
                        {item.numero_episodi} ep ({formatDuration(item.durata_min)})
                      </span>
                    ) : (
                      formatDuration(item.durata_min)
                    )}
                  </td>

                  {/* Storage Size */}
                  <td className="py-3 px-3 font-mono font-semibold text-slate-200 whitespace-nowrap">
                    {formatStorage(item.dimensione_gb)}
                  </td>

                  {/* File Path */}
                  <td className="py-3 px-4 max-w-xs">
                    <div
                      className="font-mono text-[11px] text-slate-400 truncate bg-slate-900/60 px-2 py-1 rounded border border-white/[0.05]"
                      title={item.file_path}
                    >
                      {item.file_path || 'N/D'}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {item.file_path && (
                        <button
                          onClick={(e) => handleCopy(e, item.id, item.file_path)}
                          title="Copia percorso file"
                          className={`p-1.5 rounded-lg border transition-all ${
                            isCopied
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border-white/[0.06]'
                          }`}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => onSelectItem(item)}
                        title="Apri scheda dettagli"
                        className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-white/[0.06] transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
          <div className="text-xs text-slate-400">
            Pagina <span className="font-mono font-semibold text-white">{currentPage}</span> di{' '}
            <span className="font-mono font-semibold text-white">{totalPages}</span> (
            <span className="font-mono text-amber-400">{totalFilteredCount}</span> elementi)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Precedente</span>
            </button>

            <span className="text-xs font-mono text-slate-300 px-2">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <span>Successiva</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
