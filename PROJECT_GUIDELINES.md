# PROJECT GUIDELINES: Plex Media Catalog Web Application
*Documento di Architettura del Software e Specifiche di Prodotto*
*Lead Software Architect & Product Designer*
*Data di rilascio: 26 Settembre 2026*

---

## 1. Schema Dati & Mapping Tecnico

### 1.1 Analisi delle Sorgenti Dati
Il catalogo multimediale è basato su una sorgente primaria strutturata in formato JSON e da dataset tabulari di supporto in formato CSV:
- **`data/catalog_data.json`** (~31.6 MB): È la **sorgente dati unica e completa** utilizzata dall'applicazione web (e inclusa nel bundle di produzione/GitHub Pages). Contiene la totalità del catalogo gerarchico, arricchito con metadati di runtime, registi, cast principale (top 5 attori), stagioni ed episodi, ripartito in 4 macro-librerie (`film`, `serie_tv`, `anime`, `cartoon`) per un totale di **2.969 titoli** e oltre **24.670 episodi**.
- **Dataset CSV locali** (`data/*.csv`): Esportazioni tabulari piatte generate dallo script di estrazione ad uso locale/analitico. Poiché l'applicazione web carica esclusivamente il file JSON, tutti i file CSV sono esclusi dal repository Git pubblico tramite `.gitignore` e preservati localmente.

### 1.2 Struttura del JSON Principale (`data/catalog_data.json`)
```json
{
  "metadata": {
    "last_updated": "2026-09-26T12:30:05.656161+02:00",
    "last_updated_display": "26/09/2026 alle 12:30",
    "total_titles": 2969
  },
  "catalog": {
    "film": [ /* Array di 2518 oggetti Film */ ],
    "serie_tv": [ /* Array di 168 oggetti Serie TV con stagioni ed episodi */ ],
    "anime": [ /* Array di 215 oggetti Anime con stagioni ed episodi */ ],
    "cartoon": [ /* Array di 68 oggetti Cartoon con stagioni ed episodi */ ]
  }
}
```

### 1.3 Modello Dati e Tipi TypeScript

#### A. Record Film (`FilmItem`)
Ogni film possiede direttamente le informazioni del file multimediale corrispondente:
| Campo | Tipo | Descrizione & Esempi |
| :--- | :--- | :--- |
| `id` | `number` | ID univoco Plex (es. `4929`) |
| `titolo` | `string` | Titolo localizzato in italiano (es. `"(500) giorni insieme"`) |
| `titolo_originale` | `string` | Titolo originale dell'opera (es. `"(500) Days of Summer"`) |
| `anno` | `number \| null` | Anno di uscita cinematografica (es. `2009`) |
| `trama` | `string` | Sinossi estesa della pellicola |
| `voto` | `number \| null` | Rating (valore numerico o null se assente) |
| `durata_min` | `number \| null` | Durata espressa in minuti (es. `95`) |
| `risoluzione` | `string` | Profilo video standard (`"4K UHD"`, `"1080p FHD"`, `"720p HD"`, `"576p SD"`, `"N/D"`) |
| `larghezza` | `number \| null` | Risoluzione orizzontale in pixel (es. `1920`) |
| `altezza` | `number \| null` | Risoluzione verticale in pixel (es. `800`) |
| `codec_video` | `string` | Codec di compressione video (es. `"H264"`, `"HEVC"`, `"VC1"`, `"MPEG4"`) |
| `codec_audio` | `string` | Codec traccia audio primaria (es. `"DCA"`, `"AC3"`, `"EAC3"`, `"AAC"`, `"FLAC"`, `"TRUEHD"`) |
| `canali_audio` | `number \| null` | Numero canali audio (es. `2` per stereo, `6` per 5.1 surround, `8` per 7.1) |
| `tracce_audio` | `string` | Elenco delle tracce presenti (es. `"it (DCA), en (AC3)"`) |
| `sottotitoli` | `string` | Elenco stream sottotitoli (es. `"it (SRT), it (VOBSUB), en (PGS)"`) |
| `dimensione_gb` | `number \| null` | Dimensione occupata sul filesystem in Gigabyte (es. `6.72`) |
| `file_path` | `string \| undefined` | Percorso opzionale su storage locale (omesso nel catalogo pubblico per motivi di privacy) |
| `regista` | `string \| undefined` | Regista dell'opera (es. `"Marc Webb"`, `"Sam Mendes"`, `"Stanley Kubrick"`) |
| `attori` | `string[] \| undefined` | Primi 5 attori principali in ordine di importanza / billing |

#### B. Record Serie / Anime / Cartoni (`SeriesItem`, `SeasonItem`, `EpisodeItem`)
Le opere a episodi sono modellate gerarchicamente in `stagioni` ed `episodi`.
- **`SeriesItem`**:
  - `id`: ID univoco Plex
  - `titolo`: Titolo principale serie
  - `titolo_originale`: Titolo originale
  - `anno`: Anno di inizio trasmissione
  - `trama`: Sinossi generale dell'opera
  - `voto`: Rating serie
  - `regista`: Regista / Showrunner principale (opzionale)
  - `attori`: Primi 5 attori principali del cast (opzionale)
  - `stagioni`: Array di `SeasonItem`
- **`SeasonItem`**:
  - `id`: ID stagione
  - `stagione`: Numero progressivo (`0` per speciali/extra, `1..N` per le regolari)
  - `titolo_stagione`: Etichetta (es. `"Stagione 1"`, `"Speciali"`)
  - `episodi`: Array di `EpisodeItem`
- **`EpisodeItem`**:
  - `id`: ID episodio
  - `numero`: Numero progressivo nell'ambito della stagione
  - `titolo`: Titolo dell'episodio
  - `trama`: Sinossi episodio
  - `durata_min`, `risoluzione`, `larghezza`, `altezza`, `codec_video`, `codec_audio`, `canali_audio`, `tracce_audio`, `sottotitoli`, `dimensione_gb`, `file_path` (opzionale/locale).

### 1.4 Unificazione del Modello per la UI (`UnifiedMediaItem`)
Per consentire una navigazione fluida, filtri trasversali e una visualizzazione coerente sia in griglia che in tabella, i dati vengono normalizzati dal layer dati (`useCatalogData`) in un'interfaccia unificata:
```typescript
export type MediaSection = 'film' | 'serie_tv' | 'anime' | 'cartoon';

export interface UnifiedMediaItem {
  id: number;
  section: MediaSection;
  titolo: string;
  titolo_originale: string;
  anno: number | null;
  trama: string;
  voto: number | null;
  generi: string[];               // Estratti e normalizzati con tassonomia euristica
  
  // Campi aggregati/calcolati
  durata_totale_min: number;      // Film: durata / Serie: somma durate episodi
  dimensione_totale_gb: number;   // Film: dimensione / Serie: somma storage totale
  risoluzione_massima: string;    // Profilo massimo (es. "4K UHD", "1080p FHD")
  codec_video_principale: string; // H264, HEVC, ecc.
  codec_audio_principale: string; // DCA, AC3, FLAC, ecc.
  tracce_audio_riassunto: string; // it, en, ja, ecc.
  ha_sottotitoli: boolean;
  file_path_primario?: string;    // Percorso opzionale del file (omesso nel build pubblico)
  
  // Dati specifici per Serie/Anime/Cartoon
  numero_stagioni?: number;
  numero_episodi?: number;
  stagioni?: SeasonItem[];
}
```

### 1.5 Tassonomia Generi Intelligente
Dato che il dataset nativo non include una colonna esplicita di genere per tutti i record, il client include un motore di classificazione semantica basato su parole chiave e categorie narrative nelle trame e titoli, categorizzando ciascun titolo in uno o più generi:
- **Azione** (combattimenti, rapine, inseguimenti, agenti, criminalità)
- **Commedia** (umorismo, equivoci, gag, amici, risate, nozze)
- **Drammatico** (dramma, perdita, sofferenza, lutto, crisi)
- **Fantascienza** (spazio, alieni, futuro, navicelle, robot, virus)
- **Horror** (terrore, demoni, mostri, infestazioni, sangue, zombie)
- **Thriller** (indagini, assassini, mistero, delitti, complotti)
- **Avventura** (viaggi, esplorazioni, tesori, sopravvivenza)
- **Fantasy** (magia, regni, draghi, spade, poteri mistici)
- **Romantico** (amore, relazioni, innamoramento, coppie)
- **Poliziesco** (polizia, detective, FBI, indagini legali)
- **Animazione** (attribuito a tutti i titoli di `anime` e `cartoon` oltre che film animati)
- **Generale / Altro** (titoli con trame brevi o senza parole chiave dominanti)

---

## 2. Architettura dell'Applicazione

### 2.1 Stack Tecnologico
- **Runtime & Bundler**: Vite 6 con bundling ultra-rapido ESM e HMR istantaneo.
- **Framework UI**: React 19 con TypeScript 5.7 per type safety assoluta.
- **Styling**: Tailwind CSS v3 abbinato a un design system con CSS Custom Properties per Dark Mode, Glassmorphism e animazioni fluide.
- **Iconografia**: `lucide-react` per icone chiare, scalabili e ad alta precisione.
- **Virtualizzazione & Paginazione**: Paginazione ultra-reattiva a blocchi (36/72 elementi) con calcolo memorizzato, garantendo 60fps costanti anche su migliaia di elementi.

### 2.2 Struttura Modulare delle Directory
```
plex-media-catalog/
├── data/                               # Dataset del catalogo
│   ├── catalog_data.json               # Sorgente JSON primaria per la web app (tracciata)
│   └── *.csv                           # Esportazioni CSV grezze (locali, in .gitignore)
├── scripts/                            # Script di utilità locale (in .gitignore)
│   ├── export_plex.py                  # Script Python estrazione SQLite Plex (locale/sicuro)
│   └── enrich_catalog.cjs              # Script ausiliario di arricchimento
├── src/
│   ├── components/
│   │   ├── common/                     # Componenti base riutilizzabili
│   │   │   ├── Badge.tsx               # Pillole per risoluzione, sezione e codec
│   │   │   └── StatCard.tsx            # Indicatori numerici di catalogo
│   │   ├── filters/                    # Modulo filtri avanzati
│   │   │   └── FilterSidebar.tsx       # Sidebar fissa a sinistra con scroll isolato, filtri registi, cast, risoluzioni e anno
│   │   ├── grid/                       # Visualizzazione a Griglia
│   │   │   ├── MediaGrid.tsx           # Griglia responsiva con CSS auto-fill e paginazione
│   │   │   ├── MediaCard.tsx           # Card con poster gradient, badge e hover reattivo
│   │   │   └── ViewToggle.tsx          # Switch Griglia / Tabella e selettore ordinamento
│   │   ├── table/                      # Visualizzazione Tabellare Tecnica
│   │   │   └── MediaTable.tsx          # Tabella ad alta densità (Titolo, Sezione, Anno, Regista, Risoluzione, Durata, GB) con click su riga
│   │   ├── detail/                     # Modal / Drawer di Dettaglio Tecnico
│   │   │   ├── MediaDetailDrawer.tsx   # Drawer con Regia & Cast, Stagioni/Episodi subito sotto il Cast, e Specifiche Tecniche
│   │   │   └── SeasonAccordion.tsx     # Accordion per esplorazione gerarchica di stagioni ed episodi
│   │   └── layout/                     # Struttura di pagina
│   │       └── Header.tsx              # Barra superiore con logo Plex, stats, ricerca e badge freschezza (Footer rimosso)
│   ├── hooks/
│   │   ├── useCatalogData.ts           # Caricamento, caching e indicizzazione del dataset
│   │   ├── useCatalogFilter.ts         # Motore reattivo memoizzato di filtraggio e ordinamento
│   │   └── useDebounce.ts              # Hook per debounce ricerca testuale
│   ├── types/
│   │   └── catalog.ts                  # Definizioni TypeScript esaustive
│   ├── utils/
│   │   ├── formatters.ts               # Formattazione durate, GB/TB, risoluzioni e date
│   │   ├── genreClassifier.ts          # Algoritmo di estrazione semantica generi
│   │   └── copyToClipboard.ts          # Utility per copia negli appunti con feedback
│   ├── App.tsx                         # Componente principale
│   ├── main.tsx                        # Bootstrap React
│   └── index.css                       # Design System CSS, variabili colore e utility
├── PROJECT_GUIDELINES.md               # Specifiche di progetto e linee guida architetturali
├── index.html                          # Entry point HTML semantico
├── package.json                        # Configurazione dipendenze e script
├── tailwind.config.js                  # Configurazione tema Tailwind
├── tsconfig.json                       # Configurazione TypeScript
└── vite.config.ts                      # Configurazione bundler Vite
```

### 2.3 State Management dei Filtri Combinati
I filtri sono gestiti da un reducer/state atomico memorizzato in `useCatalogFilter`:
```typescript
export interface FilterState {
  searchQuery: string;             // Ricerca su titolo, titolo originale, trama e file path
  activeSections: MediaSection[];  // Sezioni attive: ['film', 'serie_tv', 'anime', 'cartoon']
  selectedGenres: string[];        // Generi selezionati (operatore AND/OR selezionabile)
  selectedResolutions: string[];   // es. ['4K UHD', '1080p FHD']
  yearRange: [number, number];     // es. [1937, 2026]
  videoCodecs: string[];           // es. ['HEVC', 'H264']
  audioCodecs: string[];           // es. ['DCA', 'AC3', 'FLAC']
  sortBy: 'titolo' | 'anno' | 'dimensione_gb' | 'durata_min';
  sortDirection: 'asc' | 'desc';
  page: number;
  itemsPerPage: number;
}
```
Il filtraggio avviene con memoizzazione ad alte prestazioni (`useMemo`), applicando un indice testuale pre-normalizzato in lowercase per garantire tempi di risposta inferiori a **3ms** su 3.000 record.

---

## 3. Design System & UX Specifications

### 3.1 Palette Cromatica Dark Mode (WCAG AAA Conforme)
Ispirata all'interfaccia cinematografica di Plex con contrasti studiati per lunghe sessioni:
- **Canvas / Background Primario**: `#0a0d14` (Deep Space Obsidian)
- **Background Secondario (Sidebar / Navbar)**: `#111622` (Dark Slate Glass)
- **Superficie Card (Card Background)**: `#171f30` con bordo `rgba(255, 255, 255, 0.07)`
- **Superficie Hover / Elevata**: `#1e293f` con glow d'accento
- **Accento Plex Primario**: `#e5a00d` (Plex Amber Gold) - usata per pulsanti attivi, indicatori e tag in evidenza.
- **Accento Risoluzioni**:
  - `4K UHD`: Gradiente `#8b5cf6` (Viola Ultra HD) -> `#a855f7`
  - `1080p FHD`: `#0284c7` (Azzurro Cielo)
  - `720p HD`: `#0d9488` (Teal)
  - `SD / Altro`: `#64748b` (Slate Grey)
- **Testo e Contrasto**:
  - Testo Principale: `#f8fafc` (Contrasto 15.8:1 su `#0a0d14`)
  - Testo Secondario: `#94a3b8` (Contrasto 7.2:1)
  - Testo Muted: `#64748b` (Contrasto 4.6:1 conforme a WCAG AA Large)

### 3.2 Componenti UI Chiave

1. **Header & Global Stats Bar**:
   - Logo Plex Media Catalog con badge stato connessione locale.
   - Indicatori in tempo reale: Titoli Totali, Film, Serie TV, Anime, Cartoni, Dimensione Storage Totale (in Terabyte).
   - Barra di ricerca globale integrata con scorciatoia da tastiera (`Cmd+K` / `Ctrl+K`) e pulsante di cancellazione rapida.

2. **Sidebar Filtri Reattiva (Fixed & Scroll Isolato)**:
   - Fissata sul bordo sinistro della pagina (`fixed left-0 top-16 bottom-0 z-40`) per consentire accesso continuo ai controlli.
   - **Scroll isolato per area di hover**: lo scrolling con cursore sopra la sidebar muove esclusivamente i filtri, mentre lo scrolling sopra il catalogo muove la griglia/tabella.
   - Disposizione ordinata dei controlli:
     1. Selettore Sezioni Media (Film, Serie TV, Anime, Cartoon).
     2. Ricerca & Filtro Regista (con autocompletamento e contatore occorrenze).
     3. Ricerca & Filtro Cast Principale (top 5 attori per importanza di billing).
     4. Filtro Anno di Uscita a doppio slider range (estremi min/max configurabili).
     5. Pillole Risoluzione Video (4K UHD, 1080p FHD, 720p HD, SD) posizionate strategicamente subito sopra i codec.
     6. Specifiche Codec Video (HEVC, H264, ecc.) e Codec Audio (DCA, AC3, FLAC, ecc.).
     7. Tassonomia Generi con pillole e conteggio numerico istantaneo.
     8. Pulsante "Reimposta Filtri" visibile quando sono attivi criteri restrittivi.

3. **Griglia Multimediale (`MediaCard`)**:
   - Proporzione card cinematografica elegante con backdrop visuale generativo a gradiente.
   - Badge sovrapposti per risoluzione, sezione e anno.
   - Area hover con comparsa rapida di dettagli tecnici: codec, durata/episodi e pulsante di ispezione rapida.

4. **Vista Tabellare Alternativa (`MediaTable`)**:
   - Progettata per utenti tecnici e consultazione rapida del catalogo.
   - Colonne ottimizzate: **Titolo**, **Sezione**, **Anno**, **Regista** (posizionato a destra dell'Anno), **Risoluzione**, **Durata**, **Dimensione (GB)**.
   - Navigazione immediata: cliccando in qualunque punto della riga viene aperta la scheda dettaglio (nessuna colonna azioni superflua).
   - Ordinamento cliccabile su tutte le colonne con indicatori a freccia.

5. **Drawer Dettagli Tecnici (`MediaDetailDrawer`)**:
   - Apertura laterale fluida con backdrop-filter blur e navigazione con tasto `ESC`.
   - **Regia & Cast Principale**: box dedicato con regista e i 5 attori principali con chip cliccabili per filtrare istantaneamente.
   - **Esploratore Stagioni & Episodi (Serie TV, Anime, Cartoon)**: collocato **immediatamente sotto a Regia e Cast**, consentendo navigazione gerarchica rapida di stagioni ed episodi prima delle specifiche hardware.
   - Specifiche Tecniche Audio & Video: risoluzione pixel, aspect ratio calcolato, canali audio, tracce linguistiche e sottotitoli.
   - Percorso del file opzionale con tasto di copia rapida negli appunti (mostrato solo se presente in locale).

---

## 4. Strategie di Performance & Ottimizzazione

### 4.1 Caricamento e Caching del Dataset
- `catalog_data.json` viene servito tramite il server Vite / GitHub Pages nella cartella `data/`.
- Un hook dedicato `useCatalogData` effettua la richiesta una sola volta all'avvio dell'applicazione.
- Durante il caricamento, viene mostrato uno scheletro UI elegante con barra di progresso e indicatore dello stato di indicizzazione.
- I 2.969 record vengono pre-elaborati in una singola passata creando un indice normalizzato e aggregando le informazioni di serie ed episodi.

### 4.2 Debounce e Memoizzazione
- La ricerca testuale impiega un debounce di **180ms**, evitando ricalcoli inutili a ogni singolo tasto premuto.
- L'albero di filtraggio sfrutta `useMemo` con dipendenze isolate.
- Il calcolo dei conteggi per i generi e le risoluzioni disponibili è calcolato contestualmente sui record filtrati correnti.

### 4.3 Paginazione Fluida
- Paginazione client-side configurabile (25, 50, 100 o 200 elementi per pagina).
- Navigazione istantanea con tastiera o pulsanti "Precedente/Successiva" e selettore pagina diretto.
- Reset automatico a pagina 1 a ogni variazione dei filtri di ricerca.

---

## 5. Comandi di Setup, Build & Run

### 5.1 Prerequisiti
- **Node.js**: Versione 18.0 o superiore (LTS raccomandata).
- **NPM**: Versione 9.0 o superiore.

### 5.2 Installazione Dipendenze
```powershell
npm install
```

### 5.3 Avvio Server di Sviluppo Locale
```powershell
npm run dev
```

### 5.4 Build di Produzione e Deploy
```powershell
npm run build
npm run preview
```
I file compilati e ottimizzati verranno generati nella cartella `dist/` e distribuiti automaticamente su GitHub Pages tramite GitHub Actions.

---

## 6. Pipeline di Esportazione, Privacy & Politica di Freschezza Dati

### 6.1 Script di Esportazione Plex (`scripts/export_plex.py`)
I dati primari risiedono nel database SQLite originale di Plex Media Server (`com.plexapp.plugins.library.db`).
Per estrarre i metadati completi:
1. **Regista (Director)**: registrato nella tabella `taggings` con `tag_type = 4` collegato alla tabella `tags`.
2. **Attori Principali (Cast)**: registrati in `taggings` con `tag_type = 6`. Il campo `tg."index"` definisce l'ordine di importanza/billing (0 = protagonista primario, 1 = co-protagonista, ecc.). Vengono estratti i primi 5 attori in ordine di indice.
3. **Generi (Genres)**: registrati in `taggings` con `tag_type = 1`.
4. Lo script effettua una copia temporanea a caldo (`safe_copy_database`) includendo i file `-wal` e `-shm` per evitare deadlock SQLite durante l'esecuzione del server Plex.
5. I file generati (`catalog_data.json` e i CSV di supporto) vengono sincronizzati via LAN SMB su `DEV_MACHINE_DATA_DIR`.

### 6.2 Politica di Sicurezza & Igiene del Repository Git
- **Dati Pubblici vs Privati**:
  - `data/catalog_data.json` è la sorgente dati del catalogo multimediale utilizzata dall'applicazione web. Per tutelare la privacy e la sicurezza dei dispositivi privati, il catalogo pubblico non include percorsi locali di storage (`file_path`).
  - La cartella `scripts/` (contenente script di estrazione con logiche private di sincronizzazione LAN e query di manutenzione locale) è **esclusa da Git** tramite `.gitignore` e preservata esclusivamente in locale.
  - I file tabulari grezzi `data/*.csv` sono esclusi da Git tramite `.gitignore` e preservati localmente.
  - La cartella di configurazione AI `.agents/` è esclusa da Git tramite `.gitignore` e preservata localmente.

### 6.3 Politica di Verifica Freschezza (7 Giorni)
- Ogni esportazione appone nel JSON il timestamp ISO `metadata.last_updated` e `metadata.last_updated_display`.
- Sia l'assistente AI sia l'interfaccia utente (tramite badge e banner in `Header.tsx`) verificano se `daysSinceUpdate > 7`:
  - Se i dati superano i 7 giorni, viene mostrato un avviso esplicito che invita l'utente a rilanciare `export_plex.py` sul server Plex.

---

## 7. Linee Guida di Design, UX & Standard Visivi

### 7.1 Vista Tabellare (`MediaTable.tsx`)
- **Proporzioni Desktop (Somma esatta 100%)**:
  - `Titolo / Opera`: `w-[36%] min-w-[200px]` (colonna dominante per titoli lunghi e titoli originali).
  - `Tipo`: `w-[8%] min-w-[90px]` (badge centrato).
  - `Anno`: `w-[7%] min-w-[75px]` (anno centrato).
  - `Regista`: `w-[18%] min-w-[120px]` (spazio bilanciato per nomi).
  - `Risoluzione`: `w-[10%] min-w-[95px]` (badge centrato).
  - `Durata / Ep.`: `w-[11%] min-w-[100px]`.
  - `Dimensione`: `w-[10%] min-w-[90px]`.
- **Regola tecnica**: Mai usare funzioni inline `max(...)` nei tag di tabella `table-fixed` (i motori di rendering le scartano forzando larghezze uguali al 14%); usare sempre classi Tailwind percentuali con `min-w`.
- **Schermi Compatti & Mobile (< 1024px)**:
  - Eliminare la colonna `Dimensione` (`hidden lg:table-cell`).
  - Tabella con `min-w-[700px] lg:min-w-0` e scorrimento orizzontale nativo (`overflow-x-auto`). Mai usare `touch-pan-x` sul wrapper della tabella poiché disabilita lo scorrimento verticale della pagina sui dispositivi touch.

### 7.2 Scheda Dettaglio (`MediaDetailDrawer.tsx`)
- **Iconografia Coerente**: Icone dedicate accanto alle etichette (`Tag` per generi, `FileText` per sinossi, `Clapperboard` per regista, `Users` per cast).
- **Generi**: Riga orizzontale scrollabile a chip compatti (`no-scrollbar flex gap-1.5 overflow-x-auto whitespace-nowrap`).
- **Pulizia Badge**: Nessun prefisso ridondante ("Storage:", "Totale:"); mostrare solo il valore pulito (`11.35 GB`, `45h 22m`).
- **Allineamento**: Durata e dimensione allineate a destra sulla stessa riga (`ml-auto flex items-center gap-2`).
- **Serie TV vs Film**: Nelle serie TV nascondere le specifiche tecniche globali e mostrarle nell'accordion delle stagioni (`SeasonAccordion.tsx`) suddivise in 3 card (Video, Audio, Sottotitoli). Accorpare stagioni ed episodi sotto il titolo (es. `11 Stagioni • 279 episodi`).

### 7.3 Badge e Componenti Comuni (`Badge.tsx`)
- Tutti i badge includono obbligatoriamente `whitespace-nowrap shrink-0 justify-center`.

### 7.4 Workflow e Rilasci
- Sviluppare e verificare sempre in locale (`http://localhost:5173/`).
- **Nessun commit o push automatico su Git senza richiesta esplicita dell'utente.**

---
*Fine delle linee guida architetturali e di design.*
