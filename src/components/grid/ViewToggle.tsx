import React from 'react';
import {
  LayoutGrid,
  Table as TableIcon,
  ArrowUpDown,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { SortField, SortDirection, ViewMode } from '../../types/catalog';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction?: SortDirection) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  totalFilteredCount: number;
  onOpenMobileFilters: () => void;
  isFiltered: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  sortBy,
  sortDirection,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalFilteredCount,
  onOpenMobileFilters,
  isFiltered
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.06]">
      {/* Mobile Filter Button & Results Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileFilters}
          className={`lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isFiltered
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-900 border-white/[0.1] text-slate-300'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Filtri</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <div className="text-xs text-slate-400">
          Trovati <span className="font-mono font-bold text-white">{totalFilteredCount}</span> elementi
        </div>
      </div>

      {/* Controls Right */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Sort Field Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 hidden sm:inline">Ordina:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
          >
            <option value="titolo" className="bg-slate-900 text-white">Titolo</option>
            <option value="anno" className="bg-slate-900 text-white">Anno</option>
            <option value="dimensione_gb" className="bg-slate-900 text-white">Dimensione Storage</option>
            <option value="durata_min" className="bg-slate-900 text-white">Durata</option>
            <option value="voto" className="bg-slate-900 text-white">Voto</option>
          </select>

          <button
            onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
            title={sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
            className="p-1 hover:text-amber-400 text-slate-400 transition-colors ml-1"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>

        {/* Items per Page */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-white/[0.08] rounded-lg px-2 py-1 text-xs">
          <span className="text-slate-400">Per pagina:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
          >
            <option value={24} className="bg-slate-900 text-white">24</option>
            <option value={36} className="bg-slate-900 text-white">36</option>
            <option value={48} className="bg-slate-900 text-white">48</option>
            <option value={72} className="bg-slate-900 text-white">72</option>
          </select>
        </div>

        {/* View Switcher: Grid vs Table */}
        <div className="flex items-center bg-slate-900/80 border border-white/[0.08] p-0.5 rounded-lg">
          <button
            onClick={() => onViewModeChange('grid')}
            title="Vista a Griglia"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            title="Vista Tabellare Dettagliata"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
