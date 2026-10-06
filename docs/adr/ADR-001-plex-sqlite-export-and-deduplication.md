# ADR-001: Export SQLite Plex, Relazione 1:N & Deduplicazione Record

## Contesto
Nel database interno di Plex (`com.plexapp.plugins.library.db`), la tabella `metadata_items` modella il titolo logico dell'opera cinematografica, mentre `media_items` modella i singoli file multimediali o edizioni fisiche ad esso associati.
Quando un film possiede più file fisici (ad esempio due edizioni con codec audio diversi: EAC3 vs TrueHD, come nel caso di *Transformers - Il risveglio* ID `42532`), la query SQL di esportazione:
```sql
SELECT mi.id, mi.title, ...
FROM metadata_items mi
JOIN media_items mitem ON mitem.metadata_item_id = mi.id
JOIN media_parts mpart ON mpart.media_item_id = mitem.id
```
produce **più record con lo stesso `id` di metadata_item**.

## Decisione
1. Nel layer frontend (`useCatalogData.ts`), ogni record esportato deve possedere un identificativo univoco a prova di collisione. Se un `id` è duplicato, viene generato un identificativo composito (`${item.id}_${index}`) per preservare l'univocità di ciascuna riga.
2. In tutti i componenti di rendering a lista (`MediaTable.tsx`, `MediaGrid.tsx`), le chiavi React (`key`) devono utilizzare tale identificatore univoco o combinare l'indice (`${item.section}-${item.id}-${index}`) per garantire l'integrità del Virtual DOM durante riordinamenti e filtraggi.

## Conseguenze
- Prevenzione totale di bug di riconciliazione del DOM in React 18.
- Le righe della tabella mantengono la corretta reattività visiva al cambio di ordinamento.
