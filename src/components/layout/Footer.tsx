import React from 'react';
import { CatalogStats } from '../../types/catalog';
import { formatStorage } from '../../utils/formatters';

interface FooterProps {
  stats: CatalogStats | null;
}

export const Footer: React.FC<FooterProps> = ({ stats }) => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080b12] py-8 text-xs text-slate-400">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span className="font-semibold text-slate-300">Plex Media Catalog Explorer</span>
          <span>—</span>
          <span>Interfaccia ad alte prestazioni per librerie multimediali</span>
        </div>

        {stats && (
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>{stats.totalTitles.toLocaleString('it-IT')} Titoli</span>
            <span>•</span>
            <span>{stats.totalEpisodes.toLocaleString('it-IT')} Episodi</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{formatStorage(stats.totalStorageGb)} Archiviati</span>
          </div>
        )}

        <div className="text-slate-400 text-[11px]">
          Sviluppato con Vite, React & TypeScript
        </div>
      </div>
    </footer>
  );
};
