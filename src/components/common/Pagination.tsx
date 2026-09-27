import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  currentItemsCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  currentItemsCount,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min((currentPage - 1) * itemsPerPage + currentItemsCount, totalItems);

  // Generate page numbers with ellipses
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
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8 ${className}`}>
      {/* Label with visible range */}
      <div className="text-xs text-slate-400 text-center sm:text-left">
        Pagina <span className="font-mono font-semibold text-white">{currentPage}</span> di{' '}
        <span className="font-mono font-semibold text-white">{totalPages}</span>{' '}
        <span className="text-slate-400 font-normal whitespace-nowrap">
          (elementi visualizzati <span className="font-mono text-slate-200 font-medium">{startItem}-{endItem}</span>)
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Previous Page (Collapsed Icon with Tooltip) */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Pagina precedente"
          aria-label="Pagina precedente"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-white/[0.16] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`dots-${idx}`}
                  className="w-6 text-center text-xs text-slate-500 font-mono select-none"
                >
                  ...
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p as number)}
                title={`Pagina ${p}`}
                aria-label={`Pagina ${p}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-mono font-semibold transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(229,160,13,0.35)]'
                    : 'bg-slate-900/80 border border-white/[0.08] text-slate-300 hover:bg-slate-800 hover:text-white hover:border-white/[0.16]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page (Collapsed Icon with Tooltip) */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Pagina successiva"
          aria-label="Pagina successiva"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-white/[0.16] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
