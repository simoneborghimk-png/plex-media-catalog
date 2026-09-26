# 🎬 Plex Media Catalog Explorer

> **Applicazione web moderna, performante e reattiva per esplorare, cercare e filtrare il catalogo multimediale locale Plex (Film, Serie TV, Anime, Cartoni) con specifiche tecniche approfondite.**

---

## ✨ Funzionalità Chiave

- 🔍 **Ricerca Full-Text Istantanea**: Ricerca con debounce su titoli, titoli originali, trame, percorsi file e codec.
- 🎯 **Filtri Multidimensionali Reattivi**:
  - **Sezioni**: Selezione rapida o multipla tra *Film*, *Serie TV*, *Anime* e *Cartoni Animati*.
  - **Risoluzione Video**: Pillole ad attivazione istantanea (*4K UHD*, *1080p FHD*, *720p HD*, *SD*).
  - **Generi & Categorie**: Tassonomia intelligente a chip con conteggio in tempo reale (*Azione*, *Fantascienza*, *Commedia*, *Dramma*, *Thriller*, ecc.).
  - **Range Anno**: Doppia maniglia slider per filtrare per anno di uscita cinematografica (1930 – 2026).
  - **Filtri Tecnici Avanzati**: Codec video (*HEVC*, *H.264*, *VC-1*) e audio (*DTS/DCA*, *AC3*, *FLAC*, *TrueHD*).
- 🎴 **Vista a Griglia Cinematografica**:
  - Card con sfondi gradient ad atmosfera generati dinamicamente.
  - Badge luminosi per profili 4K e 1080p.
  - Metadati tecnici sintetici (durata/episodi, storage GB, codec).
- 📋 **Vista Tabellare Tecnica**:
  - Tabella ad alta densità per amministratori e collezionisti.
  - Ordinamento per colonna (Titolo, Anno, Dimensione, Durata, Voto).
  - **Copia rapida del percorso file a un clic** con notifica toast.
- 📑 **Drawer di Dettaglio & Esploratore Episodi**:
  - Scheda tecnica completa: risoluzione esatta (pixel), aspect ratio calcolato, flussi audio e sottotitoli.
  - **Modulo Stagioni & Episodi**: Esploratore a schede per le Serie TV, Anime e Cartoni con sinossi e copia percorso di ogni singolo file video.
- ⚡ **Architettura ad Alte Prestazioni**: Indicizzazione in-memory istantanea di oltre 2.900 titoli e 24.600 episodi senza rallentamenti.

---

## 🛠️ Stack Tecnologico

- **Framework**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Stile & Design**: [Tailwind CSS v3](https://tailwindcss.com/) + CSS Custom Variables Dark Mode (WCAG AAA)
- **Icone**: [Lucide React](https://lucide.dev/)
- **CI/CD & Hosting**: [GitHub Pages](https://pages.github.com/) tramite [GitHub Actions](https://github.com/features/actions)

---

## 🚀 Avvio Locale

### 1. Prerequisiti
- [Node.js](https://nodejs.org/) (versione 18 o superiore)
- `npm`

### 2. Installazione
```bash
git clone https://github.com/<TUO-USERNAME>/plex-media-catalog.git
cd plex-media-catalog
npm install
```

### 3. Server di Sviluppo
```bash
npm run dev
```
Apri il browser all'indirizzo `http://localhost:5173/`.

### 4. Build di Produzione
```bash
npm run build
npm run preview
```

---

## 🌐 Pubblicazione su GitHub Pages

Il repository è già pre-configurato con un flusso CI/CD automatico tramite **GitHub Actions** (`.github/workflows/deploy.yml`).

### Istruzioni Step-by-Step per Pubblicare:

1. **Inizializza Git e fai il primo commit**:
   ```bash
   git init -b main
   git add .
   git commit -m "feat: initial commit of Plex Media Catalog web app"
   ```

2. **Crea un nuovo repository su GitHub** (es. `plex-media-catalog`).

3. **Collega il repository remoto ed effettua il push**:
   ```bash
   git remote add origin https://github.com/<TUO-USERNAME>/plex-media-catalog.git
   git push -u origin main
   ```

4. **Abilita GitHub Pages con GitHub Actions**:
   - Vai sul tuo repository su GitHub: `Settings` > `Pages`.
   - Nella sezione **Build and deployment**, imposta **Source** su:
     👉 **GitHub Actions**
   - Non appena effettui il push su `main`, il workflow `.github/workflows/deploy.yml` si avvierà automaticamente, compilerà l'applicazione e distribuirà il sito.

5. **Accedi alla tua Web App**:
   Il sito sarà accessibile all'URL:
   ```
   https://<TUO-USERNAME>.github.io/plex-media-catalog/
   ```

---

## 📁 Struttura del Progetto

```
plex-media-catalog/
├── .github/workflows/deploy.yml   # Workflow di deploy su GitHub Pages
├── data/                          # Dataset sorgente (catalog_data.json e CSV)
├── src/
│   ├── components/
│   │   ├── common/                # Badge, StatCard
│   │   ├── detail/                # MediaDetailDrawer, SeasonAccordion
│   │   ├── filters/               # FilterSidebar, Search, Slider
│   │   ├── grid/                  # MediaGrid, MediaCard, ViewToggle
│   │   ├── layout/                # Header, Footer
│   │   └── table/                 # MediaTable
│   ├── hooks/
│   │   ├── useCatalogData.ts      # Caricamento e normalizzazione dati
│   │   ├── useCatalogFilter.ts    # Motore filtri e sorting reattivo
│   │   └── useDebounce.ts         # Debounce ricerca
│   ├── types/
│   │   └── catalog.ts             # Interfacce TypeScript
│   ├── utils/
│   │   ├── copyToClipboard.ts     # Copia negli appunti
│   │   ├── formatters.ts          # Formattatori storage, durate, risoluzioni
│   │   └── genreClassifier.ts     # Motore di classificazione generi
│   ├── App.tsx                    # Componente principale
│   ├── main.tsx                   # Entry point React
│   └── index.css                  # Stili globali Dark Mode
├── PROJECT_GUIDELINES.md          # Specifiche e architettura completa
├── vite.config.ts                 # Configurazione Vite e base path
└── package.json
```

---
*Progettato e implementato con precisione architetturale per cataloghi multimediali di grandi dimensioni.*
