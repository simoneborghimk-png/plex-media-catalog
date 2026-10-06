# ADR-004: Validazione Headless First & Divieto Browser Automation

## Contesto
I tentativi di automazione con strumenti come `browser_subagent` nell'ambiente locale di sviluppo possono causare fallimenti (mancanza di browser Playwright installati), latenze elevate e un consumo sproporzionato di token (centinaia di turni per acquisire screenshot o DOM).

## Decisione
1. È fatto esplicito divieto per gli agenti AI di invocare strumenti di browser automation (`browser_subagent`).
2. La validazione delle modifiche prima di ogni consegna avviene **esclusivamente via terminale headless**:
   - `npm run build` (che esegue `tsc -b && vite build`) per certificare la correttezza dei tipi, delle dipendenze e dell'output bundle.
3. La verifica visiva viene demandata all'utente fornendo l'URL del server locale `http://localhost:5173/`.

## Conseguenze
- Risparmio stimato di oltre l'80% dei token spesi in tentativi di automazione e polling.
- Ciclo di sviluppo rapido, affidabile e senza deadlock.
