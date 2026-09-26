import React from 'react';
import {
  Film,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { UnifiedMediaItem } from '../../types/catalog';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  items: UnifiedMediaItem[];
  currentPage: number;
  totalPages: number;
  totalFilteredCount: number;
  onPageChange: (page: number) => void;
  onSelectItem: (item: UnifiedMediaItem) => void;
  onResetFilters: () => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  currentPage,
  totalPages,
  totalFilteredCount,
  onPageChange,
  onSelectItem,
  onResetFilters
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-white/[0.06] bg-[#111622]/60">
        <div className="p-4 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-500 mb-4">
          <Film className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Nessun contenuto trovato
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Non ci sono elementi nel catalogo che corrispondono ai filtri attuali. Prova a rimuovere alcuni filtri o a cercare un termine diverso.
        </p>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(229,160,13,0.3)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reimposta tutti i filtri</span>
        </button>
      </div>
    );
  }

  // Generate pagination pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1900px]:grid-cols-5 gap-4">
        {items.map((item) => (
          <MediaCard
            key={`${item.section}-${item.id}`}
            item={item}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-8 border-t border-white/[0.06]">
          <div className="text-xs text-slate-400">
            Pagina <span className="font-mono font-semibold text-white">{currentPage}</span> di{' '}
            <span className="font-mono font-semibold text-white">{totalPages}</span> (
            <span className="font-mono text-amber-400">{totalFilteredCount}</span> titoli complessivi)
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Precedente</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`dots-${idx}`} className="px-2 text-xs text-slate-500 font-mono">
                      ...
                    </span>
                  );
                }
                const isCurrent = p === currentPage;
                return (
                  <button
                    key={`page-${p}`}
                    onClick={() => onPageChange(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(229,160,13,0.3)]'
                        : 'bg-slate-900/80 border border-white/[0.06] text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <span className="hidden sm:inline">Successiva</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
