# 🎬 Plex Media Catalog Explorer

<div align="center">

[![Deploy to GitHub Pages](https://github.com/simoneborghimk-png/plex-media-catalog/actions/workflows/deploy.yml/badge.svg)](https://github.com/simoneborghimk-png/plex-media-catalog/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/▶_Launch_App-Plex_Media_Catalog-E5A00D?style=for-the-badge&logo=plex&logoColor=black)](https://simoneborghimk-png.github.io/plex-media-catalog/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br />

<p align="center">
  <strong>A high-performance, responsive web application to explore, search, and inspect large-scale local Plex media collections with deep technical specifications.</strong>
</p>

<p align="center">
  <a href="https://simoneborghimk-png.github.io/plex-media-catalog/">
    <img src="https://img.shields.io/badge/⚡_EXPLORE_LIVE_CATALOG-CLICK_HERE-E5A00D?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Explore Live Catalog" height="40" />
  </a>
</p>

</div>

---

## 🌟 Highlights & Key Features

- ⚡ **Instant Full-Text Search**: Sub-millisecond debounced queries across localized titles, original titles, synopses, codecs, and absolute storage paths.
- 🎛️ **Multi-Dimensional Reactive Filters**:
  - **Media Section**: Instant switching or multi-selection across **Movies (Film)**, **TV Shows (Serie TV)**, **Anime**, and **Cartoons**.
  - **Director (Regia / Regista)**: Dedicated searchable filter with hit counts and quick-clear toggles to explore works by specific directors.
  - **Main Cast (Attori Principali)**: Dedicated searchable filter covering the top 5 main actors in order of billing importance.
  - **Video Resolution**: Quick-toggle pills for **4K UHD** (with neon purple glow), **1080p FHD** (sky blue), **720p HD**, and **SD / Other**.
  - **Smart Genre Taxonomy**: Dynamic semantic chip selector based on plot keyword extraction (*Action*, *Sci-Fi*, *Comedy*, *Drama*, *Horror*, *Thriller*, *Adventure*, *Animation*, etc.) with real-time match counters.
  - **Release Year Range**: Dual-handle slider filtering titles from **1930 to 2026**.
  - **Advanced Codec Filters**: Drill down by video compression (*HEVC/H.265*, *AVC/H.264*, *VC-1*, *MPEG4*) and audio stream formats (*DTS/DCA*, *AC3*, *EAC3*, *FLAC*, *TrueHD*, *AAC*).
- 🎴 **Cinematic Grid View**:
  - Generative atmospheric gradient posters tailored to each title.
  - High-contrast badges for resolution profile, release year, duration, and season counts.
  - Interactive hover state displaying synopsis preview, stream codecs, and detail inspection.
- 📋 **High-Density Technical Table View**:
  - Default high-density view (100 items per page with 25/50/100/200 options) engineered for media curators.
  - Fully sortable columns: **Title**, **Section**, **Year**, **Resolution**, **Video Codec**, **Audio Codec**, **Duration**, and **Storage Size (GB)**.
- 🔬 **Media Detail Drawer & Season/Episode Explorer**:
  - Fluid glassmorphic slide-out modal with backdrop blur and keyboard shortcut navigation (`ESC` to close).
  - **Regia & Cast Principale**: Dedicated section showcasing the director and top 5 billing actors with interactive 1-click filter chips.
  - Exact technical specifications: width × height resolution, computed aspect ratio (e.g. *16:9*, *2.39:1 Cinemascope*), audio channels (e.g. *5.1 Surround*, *Stereo*), all audio language streams, and subtitle tracks (SRT, PGS, VOBSUB).
  - **Multi-Season & Episode Explorer** for episodic shows: browse season tabs, inspect individual episode synopses, and copy individual video file paths.
- 🚀 **Zero-Lag Architecture**: In-memory indexing and single-pass normalization handling **2,969 titles** and over **24,670 episodes** at steady 60 FPS.

---

## 📊 Catalog Dataset Overview

The application indexes a rich multi-library local storage structure:

| Library Section | Titles Indexed | Format | Details Available |
| :--- | :---: | :---: | :--- |
| 🎬 **Movies (Film)** | **2,518** | Feature Films | Full video/audio streams, subtitles, exact resolutions, file paths |
| 📺 **TV Shows (Serie TV)** | **168** | Episodic Shows | 6,694 individual episodes with season breakdown and specs |
| 🌸 **Anime** | **215** | Episodic Shows | 13,292 episodes with dual-audio, FLAC/AAC tracks, and subtitles |
| 🎨 **Cartoons** | **68** | Episodic Shows | 4,690 episodes with season-level media properties |
| **TOTAL** | **2,969** | **27,190+ Files** | **Comprehensive multi-terabyte library cataloged** |

---

## 🛠️ Technology Stack

- **UI Framework**: [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Design System**: [Tailwind CSS v3](https://tailwindcss.com/) with custom dark tokens conforming to WCAG AAA contrast ratios
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment & Hosting**: [GitHub Pages](https://pages.github.com/) via automated [GitHub Actions](https://github.com/features/actions) CI/CD pipeline

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or newer — LTS v20+ recommended)
- `npm`

### 1. Clone the repository
```bash
git clone git@github.com:simoneborghimk-png/plex-media-catalog.git
cd plex-media-catalog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch local development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 4. Create production build
```bash
npm run build
npm run preview
```
The optimized bundle along with the catalog data will be output to the `dist/` directory.

---

## 🌐 Live Deployment on GitHub Pages

This repository includes an automated GitHub Actions deployment workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Accessing the Live Web App
The production application is continuously deployed and accessible at:

👉 **[https://simoneborghimk-png.github.io/plex-media-catalog/](https://simoneborghimk-png.github.io/plex-media-catalog/)**

### Automated Workflow Pipeline
Every push to the `main` branch automatically:
1. Checks out the repository.
2. Sets up Node.js with dependency caching.
3. Installs dependencies via `npm ci`.
4. Executes `npm run build` (running TypeScript verification, bundling with Vite, and staging catalog data into `dist/data/`).
5. Deploys the static assets directly to **GitHub Pages**.

---

## 📂 Project Architecture

```
plex-media-catalog/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD Pages deployment workflow
├── data/                          # Source datasets (JSON & CSV dumps)
│   ├── catalog_data.json          # Main hierarchical catalog (30 MB)
│   ├── film_metadata.csv          # Movies tabular dataset
│   ├── serie_tv_metadata.csv      # TV Series episode dataset
│   ├── anime_metadata.csv         # Anime episode dataset
│   └── cartoon_metadata.csv       # Cartoons episode dataset
├── src/
│   ├── components/
│   │   ├── common/                # Reusable UI badges and stat cards
│   │   │   ├── Badge.tsx          # Resolution, Section, and Codec badges
│   │   │   └── StatCard.tsx       # Metric cards for library totals
│   │   ├── detail/                # Modal / Drawer technical inspector
│   │   │   ├── MediaDetailDrawer.tsx # Slide-out technical inspection drawer
│   │   │   └── SeasonAccordion.tsx   # Multi-season & episode browser
│   │   ├── filters/               # Filter panel components
│   │   │   └── FilterSidebar.tsx  # Search, resolution, year slider & genre chips
│   │   ├── grid/                  # Grid presentation
│   │   │   ├── MediaCard.tsx      # Atmospheric poster card with live specs
│   │   │   ├── MediaGrid.tsx      # Responsive CSS grid & pagination controls
│   │   │   └── ViewToggle.tsx     # Grid vs Table view switcher & sort dropdown
│   │   ├── layout/                # Structural containers
│   │   │   ├── Header.tsx         # Plex branding, live stats, and section tabs
│   │   │   └── Footer.tsx         # Versioning and storage summary
│   │   └── table/                 # Tabular presentation
│   │       └── MediaTable.tsx     # Dense sortable table with instant path copying
│   ├── hooks/
│   │   ├── useCatalogData.ts      # Data loader, normalizer, and in-memory cache
│   │   ├── useCatalogFilter.ts    # Reactive multi-criteria filtering engine
│   │   └── useDebounce.ts         # High-frequency input debounce hook
│   ├── types/
│   │   └── catalog.ts             # Strict TypeScript models and interfaces
│   ├── utils/
│   │   ├── copyToClipboard.ts     # Asynchronous clipboard helper with fallback
│   │   ├── formatters.ts          # Duration, storage (TB/GB), and codec formatters
│   │   └── genreClassifier.ts     # Semantic keyword-based genre tagger
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Design tokens, scrollbar styling, and utilities
├── PROJECT_GUIDELINES.md          # Architectural blueprint and design specification
├── vite.config.ts                 # Vite bundler configuration & relative base path
├── tailwind.config.js             # Theme tokens and custom color palettes
├── tsconfig.json                  # TypeScript compiler settings
└── package.json                   # Project metadata and dependencies
```

---

## 📄 License & Credits

Designed and architected with precision for exploring large personal Plex media libraries.
Built with ❤️ using **React**, **TypeScript**, and **Vite**.
