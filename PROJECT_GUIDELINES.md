# PROJECT GUIDELINES: Plex Media Catalog Web Application
*Documento di Architettura del Software e Specifiche di Prodotto*
*Lead Software Architect & Product Designer*
*Data di rilascio: 26 Settembre 2026*

---

## 1. Schema Dati & Mapping Tecnico

### 1.1 Analisi delle Sorgenti Dati
Il catalogo multimediale locale è costituito da una sorgente primaria strutturata in formato JSON e da dataset tabulari di supporto in formato CSV:
- **`data/catalog_data.json`** (~30.6 MB): Contiene la totalità del catalogo gerarchico, arricchito con metadati di runtime, ripartito in 4 macro-librerie (`film`, `serie_tv`, `anime`, `cartoon`) per un totale di **2.969 titoli** e oltre **24.670 episodi**.
- **`data/film_metadata.csv`** (2.518 record): Esportazione tabulare piatta specifica per i lungometraggi.
- **`data/serie_tv_metadata.csv`** (6.694 record): Record dettagliati per singolo episodio delle Serie TV.
- **`data/anime_metadata.csv`** (13.292 record): Record dettagliati per singolo episodio degli Anime.
- **`data/cartoon_metadata.csv`** (4.690 record): Record dettagliati per singolo episodio dei Cartoni Animati.

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
| `file_path` | `string` | Percorso assoluto su volume di storage (es. `"L:\\500.giorni.insieme.2009.mkv"`) |
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
  - `durata_min`, `risoluzione`, `larghezza`, `altezza`, `codec_video`, `codec_audio`, `canali_audio`, `tracce_audio`, `sottotitoli`, `dimensione_gb`, `file_path`.

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
  file_path_primario: string;     // Percorso film o primo episodio disponibile
  
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
├── data/                               # Dataset originali (JSON e CSV)
├── public/                             # Asset pubblici, icone Plex, favicon
│   └── data/                           # Collegamento/copia per servire catalog_data.json
├── src/
│   ├── components/
│   │   ├── common/                     # Componenti base riutilizzabili
│   │   │   ├── Badge.tsx               # Pillole per risoluzione, formati e generi
│   │   │   ├── StatCard.tsx            # Indicatori numerici di catalogo
│   │   │   ├── Button.tsx              # Bottoni stilizzati con feedback aptico
│   │   │   └── SearchInput.tsx         # Input di ricerca con clear e scorciatoia da tastiera
│   │   ├── filters/                    # Modulo filtri avanzati
│   │   │   ├── FilterSidebar.tsx       # Pannello laterale pieghevole con tutti i comandi
│   │   │   ├── SectionTabs.tsx         # Selezione rapida: Tutti, Film, Serie, Anime, Cartoon
│   │   │   ├── GenreFilter.tsx         # Multi-select a pillole con conteggio titoli dinamico
│   │   │   ├── ResolutionSelector.tsx  # Toggle pillole 4K, 1080p, 720p, SD
│   │   │   ├── YearRangeSlider.tsx     # Range slider a doppia maniglia per gli anni
│   │   │   ├── CodecFilter.tsx         # Filtri specifici per codec audio e video
│   │   │   └── SortDropdown.tsx        # Selettore ordinamento (Titolo, Anno, Durata, Spazio GB)
│   │   ├── grid/                       # Visualizzazione a Griglia
│   │   │   ├── MediaGrid.tsx           # Griglia responsiva con CSS auto-fill
│   │   │   ├── MediaCard.tsx           # Card con poster gradient, badge codec, hover animato
│   │   │   └── ViewToggle.tsx          # Switch rapido Griglia / Tabella
│   │   ├── table/                      # Visualizzazione Tabellare Tecnica
│   │   │   ├── MediaTable.tsx          # Tabella ad alta densità informativa
│   │   │   ├── TableHeader.tsx         # Colonne ordinabili con indicatori visivi
│   │   │   └── TableRow.tsx            # Riga con badge e copia percorso istantanea
│   │   ├── detail/                     # Modal / Drawer di Dettaglio Tecnico
│   │   │   ├── MediaDetailDrawer.tsx   # Drawer laterale / Modal con effetto glassmorphism
│   │   │   ├── TechnicalSpecs.tsx      # Scheda tecnica (risoluzione, codec, bitrate, tracce)
│   │   │   ├── SeasonAccordion.tsx     # Esploratore stagioni ed episodi per Serie/Anime
│   │   │   └── EpisodeItemView.tsx     # Dettaglio singolo episodio con copia path
│   │   └── layout/                     # Struttura di pagina
│   │       ├── Header.tsx              # Barra superiore con logo Plex, stats, e ricerca
│   │       └── Footer.tsx              # Informazioni di versione e timestamp aggiornamento
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
├── PROJECT_GUIDELINES.md               # Specifiche di progetto (questo documento)
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

2. **Sidebar Filtri Reattiva**:
   - Sezione tipo media con pillole a badge contatore.
   - Range slider per l'anno con tooltip dinamico.
   - Pillole di risoluzione ad attivazione toggle immediata.
   - Selettore generi a chip con visualizzazione della quantità di titoli associati.
   - Selettore filtri tecnici avanzati (Codec video HEVC/H264, Codec audio DCA/AC3).
   - Pulsante "Reimposta Filtri" sempre visibile quando sono applicati filtri.

3. **Griglia Multimediale (`MediaCard`)**:
   - Proporzione card cinematografica (locandina 2:3 o ratio 16:10 elegante).
   - Miniatura generativa ricca basata su gradiente d'atmosfera con iniziale tipografica e backdrop visuale.
   - Badge sovrapposti per risoluzione, sezione e anno.
   - Area hover con comparsa rapida di dettagli tecnici: codec, durata/episodi e pulsante di ispezione rapida.

4. **Vista Tabellare Alternativa (`MediaTable`)**:
   - Progettata per utenti tecnici e amministratori di storage Plex.
   - Colonne: Titolo, Tipo, Anno, Risoluzione, Codec Video, Codec Audio, Durata, Dimensione GB, File Path, Azioni.
   - Ordinamento cliccabile per colonna con frecce indicatrici.
   - Pulsante di copia immediata del percorso file con tooltip di conferma ("Copiato!").

5. **Drawer / Modal Dettagli Tecnici (`MediaDetailDrawer`)**:
   - Apertura laterale fluida con backdrop-filter blur.
   - Ispezione tecnica approfondita: risoluzione esatta (larghezza x altezza), bitrate/dimensione, stream audio multipli, sottotitoli completi.
   - Percorso del file completo evidenziato in un blocco codice mono-spazio con tasto di copia a un clic.
   - **Esploratore Stagioni & Episodi per Serie, Anime e Cartoni**:
     - Selettore a tab per le stagioni (`Stagione 1`, `Stagione 2`, `Speciali`).
     - Lista degli episodi con titolo, numero, durata, risoluzione e percorso individuale di ciascun file MKV/MP4.

---

## 4. Strategie di Performance & Ottimizzazione

### 4.1 Caricamento e Caching del Dataset
- `catalog_data.json` viene servito localmente tramite il server Vite nella cartella `public/data/`.
- Un hook dedicato `useCatalogData` effettua la richiesta una sola volta all'avvio dell'applicazione.
- Durante il caricamento, viene mostrato uno scheletro UI elegante con barra di progresso e indicatore dello stato di indicizzazione.
- I 2.969 record vengono pre-elaborati in una singola passata creando:
  - Un indice di ricerca normalizzato in caratteri minuscoli.
  - Generi assegnati.
  - Aggregazioni per le serie (totale episodi, storage cumulativo, risoluzione massima).

### 4.2 Debounce e Memoizzazione
- La ricerca testuale impiega un debounce di **180ms**, evitando ricalcoli inutili a ogni singolo tasto premuto.
- L'albero di filtraggio sfrutta `useMemo` con dipendenze isolate.
- Il calcolo dei conteggi per i generi e le risoluzioni disponibili è calcolato contestualmente sui record filtrati correnti.

### 4.3 Paginazione Fluida
- Paginazione client-side configurabile (36 o 72 elementi per pagina).
- Navigazione istantanea con tastiera o pulsanti "Precedente/Successiva" e selettore pagina diretto.
- Reset automatico a pagina 1 a ogni variazione dei filtri di ricerca.

---

## 5. Comandi di Setup, Build & Run

### 5.1 Prerequisiti
- **Node.js**: Versione 18.0 o superiore (installato Node.js LTS v24+).
- **NPM**: Versione 9.0 o superiore (installato NPM v11+).

### 5.2 Installazione Dipendenze
Dalla root del progetto `c:\Users\simon\projects\plex-media-catalog`:
```powershell
npm install
```

### 5.3 Avvio Server di Sviluppo Locale
```powershell
npm run dev
```
Il server di sviluppo locale Vite si avvierà su `http://localhost:5173/`.

### 5.4 Build di Produzione e Preview
```powershell
npm run build
npm run preview
```
I file compilati e ottimizzati verranno generati nella cartella `dist/`.

---
*Fine delle linee guida architetturali. Proseguire con la FASE 2: Implementazione del Progetto.*
