# ADR-003: Motore di Filtro/Ordinamento, Tie-Breaker & Chiavi React

## Contesto
In `useCatalogFilter.ts`, il motore di ordinamento (`list.sort`) confronta due elementi in base al campo selezionato (`titolo`, `anno`, `durata_min`, `dimensione_gb`, `regista`, `voto`).
Tuttavia:
1. **Assenza di Tie-Breaker Deterministico**: Quando due elementi presentavano lo stesso valore (ad esempio stesso anno, o entrambi regista non specificato, o stessa durata), il comparatore ritornava `0`. In presenza di record multipli o ordinamento inverso (`desc`), la stabilità dell'ordinamento manteneva elementi in posizioni inattese o identiche.
2. **Collisione Chiavi React**: In `MediaTable.tsx` e `MediaGrid.tsx`, la chiave era definita come `key={`${item.section}-${item.id}``. Per opere con file multipli esportati da Plex (stesso `item.id`), due righe contigue condividevano la stessa chiave React, provocando il fallimento della riconciliazione DOM e facendo apparire righe bloccate o non riordinate.

## Decisione
1. **Tie-Breaker Alfabetico Obbligatorio**: Nel comparatore di `useCatalogFilter.ts`, se il criterio primario produce parità (`0`), viene sempre applicato come criterio secondario il confronto sul titolo con `localeCompare(..., 'it', { sensitivity: 'base' })`.
2. **Univocità Chiavi di Rendering**: La prop `key` in tabella e griglia include un identificatore di istanza o indice di iterazione, garantendo al motore di rendering React 18 chiavi univoche a livello di `<tbody>` e griglia card.

## Conseguenze
- Ordinamento sempre deterministico e coerente indipendentemente dalla direzione (asc/desc) o dal campo numerico.
- Risoluzione definitiva del bug visivo in cui titoli duplicati restavano congelati in cima alla tabella.
