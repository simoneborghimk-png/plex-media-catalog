import React from 'react';
import {
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  PanelLeftOpen
} from 'lucide-react';
import { ViewMode } from '../../types/catalog';

export interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  totalFilteredCount: number;
  onOpenMobileFilters: () => void;
  isDesktopSidebarOpen?: boolean;
  onToggleDesktopSidebar?: () => void;
  isFiltered: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalFilteredCount,
  onOpenMobileFilters,
  isDesktopSidebarOpen = true,
  onToggleDesktopSidebar,
  isFiltered
}) => {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 ml-auto shrink-0">
      {/* Mobile Filter Button */}
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

      {/* Desktop Expand Filter Button (shown when sidebar is collapsed) */}
      {!isDesktopSidebarOpen && onToggleDesktopSidebar && (
        <button
          onClick={onToggleDesktopSidebar}
          className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm ${
            isFiltered
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(229,160,13,0.2)]'
              : 'bg-slate-900/90 hover:bg-slate-800 border-white/[0.1] text-slate-300 hover:text-white'
          }`}
        >
          <PanelLeftOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Mostra Filtri</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>
      )}

      {/* Elements Count */}
      <div className="hidden sm:block text-xs text-slate-400">
        Trovati <span className="font-mono font-bold text-white">{totalFilteredCount}</span> elementi
      </div>

      {/* Items per Page */}
      <div className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-white/[0.08] rounded-lg px-2 py-1 text-xs">
        <span className="text-slate-400">Per pagina:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
        >
          <option value={25} className="bg-slate-900 text-white">25</option>
          <option value={50} className="bg-slate-900 text-white">50</option>
          <option value={100} className="bg-slate-900 text-white">100</option>
          <option value={200} className="bg-slate-900 text-white">200</option>
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
  );
};

