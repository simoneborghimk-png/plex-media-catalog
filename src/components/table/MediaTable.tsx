import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Film,
  Tv,
  Sparkles,
  Smile
} from 'lucide-react';
import {
  UnifiedMediaItem,
  SortField,
  SortDirection
} from '../../types/catalog';
import { ResolutionBadge, SectionBadge } from '../common/Badge';
import { Pagination } from '../common/Pagination';
import { formatDuration, formatStorage } from '../../utils/formatters';
import { getPosterUrl } from '../../utils/poster';

interface MediaTableProps {
  items: UnifiedMediaItem[];
  sortBy: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction?: SortDirection) => void;
  currentPage: number;
  totalPages: number;
  totalFilteredCount: number;
  itemsPerPage: number;
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
  itemsPerPage,
  onPageChange,
  onSelectItem
}) => {
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
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead>
            <tr className="border-b border-white/[0.08] bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold tracking-wider select-none">
              <th
                onClick={() => onSortChange('titolo')}
                className="w-[36%] group py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Titolo / Opera</span>
                  {renderSortIndicator('titolo')}
                </div>
              </th>
              <th className="w-[8%] py-3.5 px-3">Tipo</th>
              <th
                onClick={() => onSortChange('anno')}
                className="w-[7%] group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Anno</span>
                  {renderSortIndicator('anno')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('regista')}
                className="w-[18%] group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Regista</span>
                  {renderSortIndicator('regista')}
                </div>
              </th>
              <th className="w-[10%] py-3.5 px-3">Risoluzione</th>
              <th
                onClick={() => onSortChange('durata_min')}
                className="w-[11%] group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Durata / Ep.</span>
                  {renderSortIndicator('durata_min')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('dimensione_gb')}
                className="w-[10%] group py-3.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span>Dimensione</span>
                  {renderSortIndicator('dimensione_gb')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-slate-300">
            {items.map((item) => {
              const isSeries = item.section !== 'film';

              return (
                <tr
                  key={`${item.section}-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  {/* Title & Original Title with Mini Poster */}
                  <td className="py-2.5 px-4 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-10 rounded bg-slate-900 border border-white/[0.08] shrink-0 overflow-hidden relative flex items-center justify-center">
                        {/* Placeholder Icon */}
                        <span className="text-slate-500/80 group-hover:text-amber-400/80 transition-colors">
                          {item.section === 'film' && <Film className="w-3.5 h-3.5 text-amber-400/60" />}
                          {item.section === 'serie_tv' && <Tv className="w-3.5 h-3.5 text-blue-400/60" />}
                          {item.section === 'anime' && <Sparkles className="w-3.5 h-3.5 text-rose-400/60" />}
                          {item.section === 'cartoon' && <Smile className="w-3.5 h-3.5 text-emerald-400/60" />}
                        </span>

                        {/* Real Poster Image (overlays on top when loaded) */}
                        <img
                          src={getPosterUrl(item.id)}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-semibold text-white group-hover:text-amber-400 transition-colors truncate"
                          title={item.titolo_originale && item.titolo_originale !== item.titolo ? `${item.titolo} (${item.titolo_originale})` : item.titolo}
                        >
                          {item.titolo}
                        </div>
                        {item.titolo_originale && item.titolo_originale !== item.titolo && (
                          <div
                            className="text-[11px] text-slate-400 italic truncate"
                            title={item.titolo_originale}
                          >
                            {item.titolo_originale}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Section Badge */}
                  <td className="py-3 px-3 whitespace-nowrap overflow-hidden">
                    <SectionBadge section={item.section} />
                  </td>

                  {/* Year */}
                  <td className="py-3 px-3 font-mono font-medium text-slate-300 whitespace-nowrap overflow-hidden">
                    {item.anno || '—'}
                  </td>

                  {/* Director */}
                  <td className="py-3 px-3 text-slate-300 overflow-hidden" title={item.regista || undefined}>
                    {item.regista ? (
                      <span className="text-xs text-amber-200/90 font-medium truncate block" title={item.regista}>
                        {item.regista}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Resolution */}
                  <td className="py-3 px-3 whitespace-nowrap overflow-hidden">
                    <ResolutionBadge resolution={item.risoluzione} />
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-400 overflow-hidden">
                    {isSeries ? (
                      <span title={`${item.numero_episodi} episodi`}>
                        {item.numero_episodi} ep ({formatDuration(item.durata_min)})
                      </span>
                    ) : (
                      formatDuration(item.durata_min)
                    )}
                  </td>

                  {/* Storage Size */}
                  <td className="py-3 px-3 font-mono font-semibold text-slate-200 whitespace-nowrap overflow-hidden">
                    {formatStorage(item.dimensione_gb)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFilteredCount}
        itemsPerPage={itemsPerPage}
        currentItemsCount={items.length}
        onPageChange={onPageChange}
      />
    </div>
  );
};
