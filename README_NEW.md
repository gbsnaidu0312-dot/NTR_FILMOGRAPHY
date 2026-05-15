# 🐯 NTR FILMOGRAPHY

A cinematic fan website dedicated to **Jr. NTR** (N.T. Rama Rao Jr.), celebrating his iconic films, music, photographs, and unforgettable moments.

## ✨ Features

### 🎬 Movies Section
- **Filmstrip View**: Vertical scroll showcase with landscape banners
- **Netflix-style Grid**: Browse 30+ movies with posters
- **Movie Details**: Complete information including synopsis, cast, crew
- **Placeholder Cards**: Beautiful UI even without data

### 🎥 Videos Section
- **Event & Ads Videos**: Curated promotional content
- **Celebration Videos**: Special moments and celebrations
- **Full Video Player**: Integrated playback with controls
- **Download & Share**: Quick access buttons

### 🎵 Audio Section
- **Spotify-style UI**: Beautiful music player
- **Song Information**: Track info, artist, play count
- **Playlist Support**: Songs organized by movie

### 📸 Photos Section
- **Folder Organization**: Movies, Events, Offline
- **Gallery Viewer**: Full-screen image viewer
- **Navigation**: Previous/Next through photos
- **Download Options**: Save favorite images

---

## 🛠️ Technology Stack

**Frontend**: React 18 + Vite + TailwindCSS + Framer Motion
**Backend**: Django 4.2 + Django REST Framework + MySQL
**DevOps**: Docker-ready, environment configuration, CORS setup

---

## 🚀 Quick Start

### 1. Backend (5 minutes)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
# OR venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py shell < scripts/seed_movies.py
python manage.py runserver
```
**Backend ready at**: http://localhost:8000/api

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
**Frontend ready at**: http://localhost:5173

### ✅ Verify
- Backend API: http://localhost:8000/api/movies/
- Frontend: http://localhost:5173
- Admin: http://localhost:8000/admin

---

## 📊 Sample Data

The seed script creates:
- **5 Movies**: RRR, Devara, Simhadri, Aadi, Temper
- **15+ Videos**: Trailers and songs per movie
- **20+ Audio Songs**: Track information
- **Multiple Photo Folders**: Movies, Events, Offline
- **50+ Sample Photos**: For all categories

---

## 📡 API Endpoints

```
Movies
  GET /api/movies/
  GET /api/movies/{slug}/
  GET /api/movies/{slug}/video-cuts/
  GET /api/movies/{slug}/video-songs/
  GET /api/movies/{slug}/audio-songs/

Videos
  GET /api/videos/
  GET /api/videos/?type=cut|event|celebration|ads

Audio Songs
  GET /api/audio-songs/
  GET /api/audio-songs/?search=keyword

Photos
  GET /api/photos/folders/
  GET /api/photos/folders/{slug}/
  GET /api/photos/?folder={id}
```

---

## 🧪 Testing

### cURL
```bash
curl http://localhost:8000/api/movies/
curl http://localhost:8000/api/movies/rrr/
curl http://localhost:8000/api/videos/?type=event
```

### Postman
Import: `backend/tools/postman_collection.json`

### Browser
Just visit the API URLs directly

---

## 📁 Project Structure

```
ntr-filmography/
├── backend/
│   ├── config/        # Django settings
│   ├── apps/          # Movies, Videos, Audio, Photos
│   ├── scripts/       # seed_movies.py
│   └── tools/         # Postman collection, cURL examples
├── frontend/
│   ├── src/
│   │   ├── pages/     # Home, Movies, Photos, Videos
│   │   ├── components/
│   │   ├── services/  # API calls
│   │   └── utils/     # Helpers
│   └── package.json
└── README.md
```

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed installation
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference

---

## 🎨 Design Highlights

- Dark cinematic theme with gold accents
- Smooth animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Beautiful loading placeholders
- Netflix-style grids and carousels

---

## 🔐 Security

✅ CORS properly configured
✅ Environment variables for secrets
✅ Read-only API
✅ CSRF protection
✅ Admin panel protected

---

## 🚢 Deployment

**Backend**:
```bash
python manage.py collectstatic --noinput
gunicorn config.wsgi:application
```

**Frontend**:
```bash
npm run build
# Deploy 'dist' folder
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| MySQL error | Check DB credentials in `.env` |
| Port in use | `lsof -i :8000` and `kill -9 <PID>` |
| npm error | Run `npm install` in frontend |
| No API response | Verify backend is running |

---

## 💡 Features Explained

**Placeholder Cards**: UI works without API data
**Responsive**: Mobile-first design, scales to desktop
**Performance**: Pagination (50 items/page), lazy loading
**Accessibility**: Semantic HTML, keyboard navigation

---

## 🎯 Next Steps

1. Customize colors in `tailwind.config.js`
2. Add more data via Django admin
3. Integrate user authentication
4. Setup Cloudflare R2 for images
5. Add advanced search and filtering

---

## 🙏 Acknowledgments

Built with ❤️ for Jr. NTR fans worldwide.

Thanks to Django, React, and open source communities!

---

## ⭐ Show Your Support

If helpful:
- ⭐ Star this repo
- 📤 Share with others
- 🐛 Report bugs
- 💡 Suggest features

---

**Enjoy the NTR Filmography experience!** 🎬🐯✨
