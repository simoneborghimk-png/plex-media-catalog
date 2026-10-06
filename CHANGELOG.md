# CHANGELOG: Storico Milestone e Versioni

Tutti i cambiamenti significativi a questo progetto sono documentati in questo file.

---

## [1.2.0] - 2026-10-06
### Aggiunto
- **Architettura di Governance & Token Optimization**: Integrazione modello a 3 livelli di memoria (`PROGRESS.md`, `docs/SYSTEM_MAP.md`, `docs/adr/`).
- **Guardrail Agente**: Introdotti `.agents/rules/token_and_context_guard.md` e `.agents/rules/plan_first_and_sync_gate.md`.
- **Decisioni Architetturali (ADR)**: Registrazione formale di ADR-001, ADR-002, ADR-003, ADR-004.

### Corretto
- **GitHub Pages CI Lock**: Impostato `cancel-in-progress: false` in `.github/workflows/deploy.yml` per prevenire deadlock della coda di rilascio.
- **Freschezza Dati Produzione**: Rilasciato l'aggiornamento catalogo del 05/10/2026 (2.973 titoli totali).
- **Riconciliazione React & Sort Bug**: Risolto problema di chiavi duplicate per film con edizioni multiple (es. *Transformers - Il risveglio*) e aggiunto tie-breaker deterministico al motore di ordinamento.

---

## [1.1.0] - 2026-09-30
### Aggiunto
- Cache-busting condizionale su `catalog_data.json` per evitare servitù di cache HTTP stale.
- Sanitizzazione completa dei percorsi file privati da catalogo e script.
- Esclusione degli script batch e locali dal tracking Git.

---

## [1.0.0] - 2026-09-26
### Aggiunto
- Prima versione completa di Plex Media Catalog con supporto per 4 librerie (`film`, `serie_tv`, `anime`, `cartoon`).
- Visualizzazione a Griglia e Tabellare, Drawer di dettaglio con tracce audio/sub e locandine WebP.
