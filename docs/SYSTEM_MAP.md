# Mappa del Sistema Architetturale (System Map)

Guida di orientamento rapido per agenti AI e sviluppatori. Descrive il flusso dei dati, la divisione dei moduli e il ciclo di vita applicativo.

```
+-----------------------------------------------------------------------------------+
|                           PIPELINE DATI LOCALE PLEX                              |
|  Database SQLite Plex  -->  scripts/export_plex.py  -->  data/catalog_data.json  |
|  (condivisione LAN UNC)     (sanitizzazione percorsi)    public/posters/*.webp    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        LAYER DATI FRONTEND (useCatalogData)                      |
|  - Fetch asincrono HTTP /data/catalog_data.json (cache: no-cache)                 |
|  - Normalizzazione in UnifiedMediaItem[] (id, titolo, generi, durate, risoluzione)|
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                       MOTORE FILTRI & STATO (useCatalogFilter)                   |
|  - Filtri: Sezioni, Generi, Risoluzioni, Registi, Attori, Codec, Anno (min/max)   |
|  - Ricerca Fulltext: Token indicizzati con debounce 180ms                        |
|  - Sort Engine: Ordinamento dinamico (titolo, anno, durata, dimensione, regista)  |
|  - Pagination Engine: Paginazione lato client (25, 50, 100, 200 per pagina)       |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        INTERFACCIA UTENTE (App.tsx)                               |
|  +-----------------------------------------------------------------------------+  |
|  | Header.tsx: Ricerca rapida, conteggi globali, toggle filtri e vista         |  |
|  +-----------------------------------------------------------------------------+  |
|  | FilterSidebar.tsx (Desktop fisso a sinistra / Drawer scorrevole su mobile) |  |
|  +-----------------------------------------------------------------------------+  |
|  | VIEWPORT CONTENUTI PRINCIPALE:                                              |  |
|  |  - ViewMode 'grid'  --> MediaGrid.tsx + MediaCard.tsx                       |  |
|  |  - ViewMode 'table' --> MediaTable.tsx (tabella ordinabile dettagliata)     |  |
|  +-----------------------------------------------------------------------------+  |
|  | DETTAGLIO MODALE:                                                           |  |
|  |  - MediaDetailDrawer.tsx: Specifiche tecniche audio/video, cast, trama      |  |
|  |  - SeasonAccordion.tsx: Albero stagioni ed episodi per serie, anime, cartoni|  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## Moduli Chiave e Responsabilità

| File | Responsabilità |
| :--- | :--- |
| `src/hooks/useCatalogData.ts` | Caricamento e parsing iniziale JSON; appiattimento film e serie in lista unica normalizzata. |
| `src/hooks/useCatalogFilter.ts` | Single source of truth per filtri, debounce, conteggi facet, ordinamento e paginazione. |
| `src/components/table/MediaTable.tsx` | Visualizzazione tabellare con trigger di ordinamento sulle intestazioni di colonna. |
| `src/components/grid/MediaGrid.tsx` | Visualizzazione a card con locandine WebP e badge di risoluzione. |
| `src/components/filters/FilterSidebar.tsx` | Sidebar collassabile con filtri a faccette (generi, anni, codec, risoluzioni, cast). |
| `src/components/detail/MediaDetailDrawer.tsx` | Pannello a comparsa con specifiche audio/video, tracce, sottotitoli e stagioni. |
| `vite.config.ts` | Plugin per servire `/data/` e `/posters/` in dev; copia atomica in `dist/data/` a fine build. |
| `.github/workflows/deploy.yml` | Workflow GitHub Actions per compilazione e deploy automatico su GitHub Pages. |
