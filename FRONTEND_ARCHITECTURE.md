# Frontend Architecture — NTR Filmography

## Project Stack
- **React 18** — Component-based UI
- **Vite** — Build tool & dev server (port 5173 / 3001)
- **TailwindCSS 3** — Utility-first styling
- **Framer Motion** — Page transitions, animations, modals
- **React Router v6** — Client-side routing
- **Axios** — HTTP client for API calls

## Directory Structure
```
frontend/src/
├── assets/                  # Static media & SVG icons
│   ├── icons/               # 15 inline SVG icon components
│   │   ├── index.js         # Re-export all icons
│   │   └── *.jsx            # Individual icon components
│   └── *.jpg                # Sample images for UI demo
├── components/              # Shared components
│   ├── Common.jsx           # LoadingSpinner, VideoPlayer, AudioPlayer, EmptyState, ErrorBoundary
│   ├── HeroSection.jsx      # Landing page hero with category cards
│   └── Navigation.jsx       # Top nav bar (hidden on main pages)
├── pages/                   # Page-level components
│   ├── HomePage.jsx         # Hero + Infinite Biography Marquee
│   ├── MoviesPage.jsx       # Filmstrip + Grid + Audio Player
│   ├── MovieDetailsPage.jsx # Movie detail + audio songs
│   ├── PhotosPage.jsx       # Categories → Folders → Grid → Lightbox
│   ├── VideosCutsPage.jsx   # Categories → Movies → Grid → Player
│   └── VideosPage.jsx       # Categories → Folders → Grid → Player
├── services/
│   └── api.js               # Axios instance + API method objects
├── utils/
│   └── helpers.js           # formatDuration, formatViews, generatePlaceholders, handleApiError
├── App.jsx                  # Router setup with all routes
├── index.css                # Global styles & custom utilities
└── main.jsx                 # Entry point
```

## Routing Map
| Path | Page Component | Description |
|------|---------------|-------------|
| `/` | HomePage | Hero section + biography marquee |
| `/movies` | MoviesPage | All NTR movies with filmstrip & audio |
| `/movies/:slug` | MovieDetailsPage | Single movie + audio playlist |
| `/photos` | PhotosPage | Photo gallery with categories/folders/lightbox |
| `/video-cuts` | VideosCutsPage | Video songs & movie cuts by film |
| `/videos` | VideosPage | Events, ads & celebration videos |
| `*` | 404 | Fallback page |

## Page Flows (User Interaction)

### HomePage `/`
1. **HeroSection** — 4 category cards (MOVIES, PHOTOS, VIDEO CUTS, VIDEOS) with animated entrance
2. **Infinite Marquee** — Auto-scrolling biography cards. Click opens a modal with full event details

### MoviesPage `/movies`
1. **Filmstrip View** — Horizontal scrollable row of movie posters with poster card details
2. **Grid View** — Toggleable grid of all movies with hover effects
3. **Audio Player** — Fixed-bottom Spotify-style player with waveform visualization
4. Click a movie → navigates to `/movies/:slug`

### MovieDetailsPage `/movies/:slug`
1. Fetches movie detail + audio songs for that slug
2. Displays movie info (poster, banner, metadata)
3. Audio songs as an interactive playlist

### PhotosPage `/photos`
1. **Categories** → MOVIES / EVENTS / OFFLINE
2. **Select category** → Folder grid (each folder shows photo count)
3. **Select folder** → Photo grid (switches between Large/Medium/Compact layouts)
4. **Grid View Toggle** — 3 icons in top-right: large (3-col), medium (4-col), compact (6-col)
5. **Click photo** → Lightbox opens:
   - Top action bar: Download, Share, Like (heart toggle)
   - Full-screen image with left/right navigation arrows
   - Caption + counter (e.g., "3 / 12")
   - Thumbnail strip at bottom — click to jump
6. Close lightbox → back to grid

### VideosCutsPage `/video-cuts`
1. **Categories** → VIDEO SONGS / MOVIE CUTS
2. **Select category** → Movie grid (posters with title + year)
3. **Select movie** → Video grid (toggles Large/Medium/Compact)
4. **Grid View Toggle** — 3 icons in top-right
5. **Click video** → Lightbox opens:
   - Top action bar: Download, Share, Like
   - VideoPlayer (iframe) with left/right navigation arrows
   - Title + counter
   - Thumbnail strip at bottom with video titles — click to jump
6. Close lightbox → back to grid

### VideosPage `/videos`
1. **Categories** → EVENTS & ADS / CELEBRATIONS
2. **Select category** → Folder grid (each folder shows video count)
3. **Select folder** → Video grid (toggles Large/Medium/Compact)
4. Same lightbox experience as VideosCutsPage

## Shared Components (Common.jsx)
| Component | Props | Usage |
|-----------|-------|-------|
| LoadingSpinner | — | Full-screen rotation animation |
| PlaceholderCard | title, image, type | Fallback display card |
| VideoPlayer | url, thumbnail | iframe-based video embed (aspect-video) |
| AudioPlayer | title, duration, url, plays | Inline `<audio>` controls |
| EmptyState | title, description, actionText, onAction | When no data available |
| ErrorBoundary | message, onRetry | Full-screen error with retry |
| ToastNotification | message, type, onClose | Top-right notification toast |

## API Service Layer (`services/api.js`)
Base URL from env: `VITE_API_URL` (default: `http://localhost:8000/api`)

```js
moviesApi.getAll(page)           // GET /api/movies/?page=1
moviesApi.getBySlug(slug)        // GET /api/movies/{slug}/
moviesApi.getVideocuts(slug)     // GET /api/movies/{slug}/video-cuts/
moviesApi.getVideoSongs(slug)    // GET /api/movies/{slug}/video-songs/
moviesApi.getAudioSongs(slug)    // GET /api/movies/{slug}/audio-songs/
moviesApi.search(query)          // GET /api/movies/?search=query

videosApi.getByType(type)        // GET /api/videos/?type=cut|song|event|celebration

audioApi.getAll(page)            // GET /api/audio-songs/?page=1
audioApi.search(query)           // GET /api/audio-songs/?search=query

photosApi.getFolders(type)       // GET /api/photos/folders/?type=movie|event|offline
photosApi.getFolderBySlug(slug)  // GET /api/photos/folders/{slug}/  (includes nested photos)
photosApi.getFolderSubfolders(s) // GET /api/photos/folders/{slug}/subfolders/
photosApi.getPhotos(folderId)    // GET /api/photos/?folder=ID
```

## Styling System
- **TailwindCSS** with custom theme colors: `gold`, `golden`, `dark`, `charcoal`
- **Custom card classes**: `hero-card-gold`, `hero-card-red`, `hero-card-blue`, `hero-card-pink`, etc.
- **Typography**: `'Cinzel', serif` (headings), `'Great Vibes', cursive` (signatures)
- All pages share consistent dark background, gold accents, motion animations
