# PROGRESS: Cruscotto Operativo Plex Media Catalog

Memoria calda per agenti AI. Consultazione obbligatoria ad avvio sessione (Azione Zero). Mantenere $\le 100$ righe.

---

## 1. Coordinate & Stack Attivo
- **Progetto**: Plex Media Catalog (Esploratore Web per librerie Plex locali)
- **Stack**: React 18.3, Vite 6.1, TypeScript 5.7, TailwindCSS 3.4, Lucide React
- **Dev Server**: `http://localhost:5173/` (`npm run dev`)
- **Produzione**: GitHub Pages (`https://simoneborghimk-png.github.io/plex-media-catalog/`)
- **Pipeline CI**: `.github/workflows/deploy.yml` (branch `main`, `cancel-in-progress: false`)

---

## 2. Metriche Catalogo & Freschezza Dati
- **File sorgente JSON**: `data/catalog_data.json` (~28 MB, 2.973 titoli totali)
  - `film`: 2.521 titoli | `serie_tv`: 168 serie | `anime`: 215 serie | `cartoon`: 69 serie
- **Ultimo aggiornamento dataset**: `05/10/2026 alle 21:14` (Stato: Fresco, $\le 7$ giorni)
- **Locandine**: `public/posters/<id>.webp` (2.974 locandine ottimizzate WebP)
- **Script estrazione**: `scripts/export_plex.py` (locale, protetto da `.gitignore`)

---

## 3. Indice Decisioni Architetturali (ADR)
Consultare chirurgicamente il singolo file in `docs/adr/` all'occorrenza (0 token all'avvio).

| ADR | Titolo Sintetico | File di Riferimento |
| :--- | :--- | :--- |
| **ADR-001** | Export SQLite Plex, Relazione 1:N & Deduplicazione Record | `docs/adr/ADR-001-plex-sqlite-export-and-deduplication.md` |
| **ADR-002** | GitHub Actions Pages: Concurrency & Lock di Rilascio | `docs/adr/ADR-002-github-actions-pages-concurrency.md` |
| **ADR-003** | Motore di Filtro/Ordinamento, Tie-Breaker & Chiavi React | `docs/adr/ADR-003-table-sort-engine-and-react-keys.md` |
| **ADR-004** | Validazione Headless First & Divieto Browser Automation | `docs/adr/ADR-004-headless-first-validation.md` |

---

## 4. Backlog Attivo & Stato Lavori
- [x] Sincronizzazione workflow GitHub Actions Pages (`cancel-in-progress: false`).
- [x] Aggiornamento deploy GitHub Pages con catalogo del 05/10/2026.
- [x] Definizione architettura governance, guardrail token e memoria a 3 livelli.
- [x] Risolto bug ordinamento/chiavi duplicate ("Transformers - Il risveglio", ADR-001/ADR-003).
- [x] Validazione headless con `npm run build` completata (0 errori).
- [ ] Revisione visiva utente su `:5173` e autorizzazione per eventuale push.
