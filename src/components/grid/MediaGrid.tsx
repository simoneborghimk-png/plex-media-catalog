import React from 'react';
import { Film, RotateCcw } from 'lucide-react';
import { UnifiedMediaItem } from '../../types/catalog';
import { MediaCard } from './MediaCard';
import { Pagination } from '../common/Pagination';

interface MediaGridProps {
  items: UnifiedMediaItem[];
  currentPage: number;
  totalPages: number;
  totalFilteredCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSelectItem: (item: UnifiedMediaItem) => void;
  onResetFilters: () => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  currentPage,
  totalPages,
  totalFilteredCount,
  itemsPerPage,
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


  return (
    <div className="space-y-6">
      {/* Grid of Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 gap-3 sm:gap-3.5">
        {items.map((item) => (
          <MediaCard
            key={`${item.section}-${item.id}`}
            item={item}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {/* Pagination Bar */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFilteredCount}
        itemsPerPage={itemsPerPage}
        currentItemsCount={items.length}
        onPageChange={onPageChange}
        className="pt-6 border-t border-white/[0.06]"
      />
    </div>
  );
};
