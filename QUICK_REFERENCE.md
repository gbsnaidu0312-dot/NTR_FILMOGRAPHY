# 🚀 NTR FILMOGRAPHY - QUICK REFERENCE

## Essential Commands

### Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data
python manage.py shell < scripts/seed_movies.py

# Start development server
python manage.py runserver

# Access admin panel
# http://localhost:8000/admin
```

### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## URLs & Endpoints

### Frontend
- **Home**: http://localhost:5173
- **Movies**: http://localhost:5173/movies
- **Movie Details**: http://localhost:5173/movies/{slug}
- **Photos**: http://localhost:5173/photos
- **Videos**: http://localhost:5173/videos

### Backend API
- **Base URL**: http://localhost:8000/api
- **Movies**: /movies/ | /movies/{slug}/
- **Videos**: /videos/ | /videos/?type=cut|event
- **Audio**: /audio-songs/
- **Photos**: /photos/folders/ | /photos/

### Admin
- **Django Admin**: http://localhost:8000/admin

---

## Common API Calls

```bash
# Get all movies
curl http://localhost:8000/api/movies/

# Get specific movie
curl http://localhost:8000/api/movies/rrr/

# Get video cuts
curl http://localhost:8000/api/movies/rrr/video-cuts/

# Get event videos
curl http://localhost:8000/api/videos/?type=event

# Get audio songs
curl http://localhost:8000/api/audio-songs/

# Get photo folders
curl http://localhost:8000/api/photos/folders/

# Get movie photos
curl http://localhost:8000/api/photos/folders/rrr/
```

---

## File Locations

```
Backend Config
  └─ backend/config/settings.py        [Database, CORS, Apps]
  └─ backend/.env.example              [Environment variables]
  └─ backend/requirements.txt           [Python dependencies]

Frontend Config
  └─ frontend/tailwind.config.js        [Colors, animations]
  └─ frontend/package.json              [Dependencies]
  └─ frontend/vite.config.js            [Build config]

Sample Data
  └─ backend/scripts/seed_movies.py     [5 movies + data]

Testing Tools
  └─ backend/tools/postman_collection.json
  └─ backend/tools/curl_examples.sh

Models & Views
  └─ backend/apps/{movies,videos,audio,photos}/models.py
  └─ backend/apps/{movies,videos,audio,photos}/views.py
  └─ backend/apps/{movies,videos,audio,photos}/serializers.py

Frontend Pages
  └─ frontend/src/pages/HomePage.jsx
  └─ frontend/src/pages/MoviesPage.jsx
  └─ frontend/src/pages/MovieDetailsPage.jsx
  └─ frontend/src/pages/PhotosPage.jsx
  └─ frontend/src/pages/VideosPage.jsx
```

---

## Troubleshooting Quick Fixes

### Backend Won't Start
```bash
# Check if MySQL is running
# Check .env file exists and is correct
python manage.py migrate
python manage.py runserver
```

### Frontend Won't Load
```bash
cd frontend
npm install
npm run dev
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Database Error
```bash
# Recreate database
python manage.py migrate --clear-history
python manage.py migrate
python manage.py shell < scripts/seed_movies.py
```

---

## Project Files Summary

| File | Purpose |
|------|---------|
| QUICK_START.md | 5-minute setup guide |
| SETUP_GUIDE.md | Detailed setup instructions |
| API_DOCUMENTATION.md | Complete API reference |
| PROJECT_SUMMARY.md | Full project status |
| QUICK_REFERENCE.md | This file - commands |

---

## Key Technologies

**Backend**: Django 4.2, Django REST Framework, MySQL
**Frontend**: React 18, Vite, TailwindCSS, Framer Motion
**Database**: MySQL with 5 tables, proper relationships
**API**: RESTful, paginated, searchable, filterable

---

## Sample Data Included

- **5 Movies**: RRR, Devara, Simhadri, Aadi, Temper
- **Videos**: 15+ trailers and songs
- **Audio**: 20+ song tracks
- **Photos**: 50+ sample images in 10 folders
- **Folder Types**: Movie, Event, Offline

---

## Development Workflow

1. **Backend Changes** → Auto-reload (Django)
2. **Frontend Changes** → Instant refresh (Vite HMR)
3. **Database Changes** → Use Django admin or migration
4. **API Testing** → Use Postman or cURL
5. **Styling** → Edit TailwindCSS config

---

## Performance Tips

- API pagination: 50 items/page
- Images: Lazy load, use placeholders
- Frontend: Vite bundle optimization
- Backend: Database indexes on search fields
- Animations: GPU-accelerated with Framer Motion

---

## Deployment Checklist

- [ ] Change SECRET_KEY in .env
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_HOSTS
- [ ] Configure MySQL database
- [ ] Run collectstatic
- [ ] Build frontend (npm run build)
- [ ] Setup CORS for your domain
- [ ] Enable HTTPS

---

## Useful Django Commands

```bash
# Run shell
python manage.py shell

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests (if added)
python manage.py test

# Clear cache
python manage.py clear_cache
```

---

## Useful npm Commands

```bash
# Install all dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

---

## Environment Variables (.env)

```env
SECRET_KEY=change-this-in-production
DEBUG=True                                    # Set False in production
DB_NAME=ntr_filmography
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## API Response Examples

### Movie Response
```json
{
  "id": 1,
  "title": "RRR",
  "slug": "rrr",
  "release_year": 2022,
  "genre": "Action/Drama",
  "director": "S. S. Rajamouli",
  "duration_minutes": 187,
  "box_office": "$150M+",
  "description": "...",
  "poster_url": "https://...",
  "banner_url": "https://..."
}
```

### Video Response
```json
{
  "id": 1,
  "title": "Trailer",
  "video_type": "cut",
  "video_url": "https://youtube.com/...",
  "thumbnail_url": "https://...",
  "duration_seconds": 150,
  "views": 50000
}
```

---

## Browser DevTools Tips

- **Network Tab**: Watch API requests
- **Console**: Check for errors
- **Elements**: Inspect HTML structure
- **Application**: Check local storage
- **Sources**: Debug JavaScript

---

## Git Workflow (Optional)

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "message"

# Push
git push origin main
```

---

## Documentation Quick Links

| Document | Use When |
|----------|----------|
| QUICK_START.md | Starting fresh, need 5-min setup |
| SETUP_GUIDE.md | Need detailed instructions |
| API_DOCUMENTATION.md | Building frontend, need endpoints |
| PROJECT_SUMMARY.md | Want full project overview |
| QUICK_REFERENCE.md | Need commands & URLs quickly |

---

## Getting Help

1. **Read the docs** (5 files available)
2. **Check error messages** (very descriptive)
3. **Use Django admin** (for data inspection)
4. **Check code comments** (in model files)
5. **Test with Postman** (before frontend)

---

## Success Indicators

✅ Backend running on http://localhost:8000
✅ Frontend running on http://localhost:5173
✅ API returns JSON at /api/movies/
✅ Home page loads with 3 cards
✅ Movies page shows grid
✅ Photo viewer works
✅ Admin panel accessible

---

## Remember

- 📝 Always read error messages carefully
- 🔐 Keep your .env file secret
- 💾 Use Django migrations for DB changes
- 🧪 Test API before building UI
- 📚 Documentation is your friend
- 🐛 Check browser console for errors
- ⚙️ Restart servers after config changes

---

**Last Updated**: May 1, 2026
**Project Status**: ✅ READY TO RUN
**Estimated Setup Time**: 5-10 minutes

**Ready to build? Start with QUICK_START.md!** 🚀
