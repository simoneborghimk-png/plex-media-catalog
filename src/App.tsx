import React, { useState } from 'react';
import { useCatalogData } from './hooks/useCatalogData';
import { useCatalogFilter } from './hooks/useCatalogFilter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FilterSidebar } from './components/filters/FilterSidebar';
import { ViewToggle } from './components/grid/ViewToggle';
import { MediaGrid } from './components/grid/MediaGrid';
import { MediaTable } from './components/table/MediaTable';
import { MediaDetailDrawer } from './components/detail/MediaDetailDrawer';
import { UnifiedMediaItem } from './types/catalog';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const { items, stats, isLoading, error, loadingStep } = useCatalogData();
  const [selectedItem, setSelectedItem] = useState<UnifiedMediaItem | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    filters,
    viewMode,
    paginatedItems,
    totalPages,
    totalFilteredCount,
    facetCounts,
    isFiltered,
    setSearchQuery,
    toggleSection,
    setAllSections,
    toggleGenre,
    clearGenres,
    toggleResolution,
    toggleDirector,
    clearDirectors,
    toggleActor,
    clearActors,
    toggleVideoCodec,
    toggleAudioCodec,
    setYearRange,
    setSort,
    setPage,
    setItemsPerPage,
    setViewMode,
    resetFilters
  } = useCatalogFilter(items);

  // Loading State with Cinematic Splash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_35px_rgba(229,160,13,0.4)] animate-pulse">
            <svg className="w-8 h-8 text-black fill-current ml-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/30 animate-ping pointer-events-none"></div>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          Plex Media Catalog
        </h2>
        <p className="text-xs font-mono text-amber-400/90 mb-4 animate-pulse">
          {loadingStep}
        </p>

        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full animate-[progress_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Impossibile caricare il catalogo
        </h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 font-mono">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(229,160,13,0.3)]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Riprova</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col">
      {/* Top Header & Quick Section Toggles */}
      <Header
        stats={stats}
        activeSections={filters.sections}
        onToggleSection={toggleSection}
        onSelectAllSections={setAllSections}
      />

      {/* Main Body Layout: Sidebar + Media View */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          facetCounts={facetCounts}
          totalFilteredCount={totalFilteredCount}
          totalCatalogCount={items.length}
          isFiltered={isFiltered}
          onSearchChange={setSearchQuery}
          onToggleResolution={toggleResolution}
          onToggleGenre={toggleGenre}
          onClearGenres={clearGenres}
          onToggleDirector={toggleDirector}
          onClearDirectors={clearDirectors}
          onToggleActor={toggleActor}
          onClearActors={clearActors}
          onToggleVideoCodec={toggleVideoCodec}
          onToggleAudioCodec={toggleAudioCodec}
          onYearRangeChange={setYearRange}
          onResetFilters={resetFilters}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Media Content Area */}
        <main className="flex-1 min-w-0">
          {/* View Toolbar: Sort, Per Page, Grid/Table Switcher */}
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            onSortChange={setSort}
            itemsPerPage={filters.itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalFilteredCount={totalFilteredCount}
            onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            isFiltered={isFiltered}
          />

          {/* Grid or Table Display */}
          {viewMode === 'grid' ? (
            <MediaGrid
              items={paginatedItems}
              currentPage={filters.page}
              totalPages={totalPages}
              totalFilteredCount={totalFilteredCount}
              onPageChange={setPage}
              onSelectItem={setSelectedItem}
              onResetFilters={resetFilters}
            />
          ) : (
            <MediaTable
              items={paginatedItems}
              sortBy={filters.sortBy}
              sortDirection={filters.sortDirection}
              onSortChange={setSort}
              currentPage={filters.page}
              totalPages={totalPages}
              totalFilteredCount={totalFilteredCount}
              onPageChange={setPage}
              onSelectItem={setSelectedItem}
            />
          )}
        </main>
      </div>

      {/* Technical Detail Drawer / Modal */}
      <MediaDetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onFilterByDirector={toggleDirector}
        onFilterByActor={toggleActor}
      />

      {/* Footer */}
      <Footer stats={stats} />
    </div>
  );
};

export default App;
