# ADR-002: GitHub Actions Pages: Concurrency & Lock di Rilascio

## Contesto
Nel workflow `.github/workflows/deploy.yml`, il job di deploy su GitHub Pages interagisce con l'ambiente protetto `github-pages`.
L'impostazione precedente:
```yaml
concurrency:
  group: 'pages'
  cancel-in-progress: true
```
causava un deadlock in presenza di push ravvicinati: la cancellazione forzata a metà esecuzione di un run in corso lasciava bloccato il lock dell'ambiente di deploy, facendo scadere in timeout (15 minuti) il job successivo e lasciando GitHub Pages non aggiornato alla versione più recente.

## Decisione
Impostare tassativamente `cancel-in-progress: false` per il gruppo di concorrenza `pages`:
```yaml
concurrency:
  group: 'pages'
  cancel-in-progress: false
```
Come prescritto dalle linee guida ufficiali di GitHub per i rilasci su Pages, i job in coda attendono il completamento del deploy precedente senza causare cancellazioni corrotte o lock persistenti.

## Conseguenze
- Ogni push su `main` viene processato in modo serializzato e affidabile.
- I rilasci su GitHub Pages riflettono immediatamente l'ultimo commit.
