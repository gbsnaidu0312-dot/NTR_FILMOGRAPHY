# Quick Start Guide - NTR Filmography

Get the NTR Filmography project running in just 5 minutes!

## One-Line Setup (Copy & Paste)

### Windows (PowerShell)
```powershell
# Backend
cd backend; python -m venv venv; .\venv\Scripts\activate; pip install -r requirements.txt; copy .env.example .env; python manage.py migrate; python manage.py shell < scripts/seed_movies.py; python manage.py runserver

# In another terminal, Frontend
cd frontend; npm install; npm run dev
```

### macOS/Linux (Bash)
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cp .env.example .env && python manage.py migrate && python manage.py shell < scripts/seed_movies.py && python manage.py runserver

# In another terminal, Frontend
cd frontend && npm install && npm run dev
```

## Step-by-Step Setup

### 1. Clone/Extract the Project
```bash
cd ntr-filmography
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env if needed (DB credentials, etc.)

# Create database tables
python manage.py migrate

# Load sample data
python manage.py shell < scripts/seed_movies.py

# Start server
python manage.py runserver
```

✅ Backend ready at: **http://localhost:8000**

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend ready at: **http://localhost:5173**

## Verification

- [ ] Backend running: Visit http://localhost:8000/api/movies/
- [ ] Frontend running: Visit http://localhost:5173
- [ ] Admin panel: http://localhost:8000/admin (create superuser first!)
- [ ] Sample data loaded: Should see 5 movies in the API response

## Troubleshooting

### "Module not found" (Backend)
```bash
pip install -r requirements.txt
```

### "npm ERR!" (Frontend)
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### MySQL Connection Error
- Ensure MySQL is running
- Update DB credentials in `.env`
- Or use SQLite for development (change in settings.py)

### Port Already in Use
```bash
# Backend (find and kill process on port 8000)
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

## Next Steps

1. **Create Admin User** (if not created during seed)
   ```bash
   python manage.py createsuperuser
   ```

2. **Access Admin Panel**
   - URL: http://localhost:8000/admin
   - Add movies, videos, photos directly

3. **Test API with Postman**
   - Import `backend/tools/postman_collection.json`
   - Test all endpoints

4. **Customize**
   - Edit `frontend/src/components/` for UI changes
   - Edit `backend/config/settings.py` for backend config

## Project Structure
```
ntr-filmography/
├── backend/          # Django API
│   ├── config/       # Settings
│   ├── apps/         # Movies, Videos, Photos, etc.
│   └── scripts/      # seed_movies.py
├── frontend/         # React UI
│   └── src/
│       ├── pages/    # Home, Movies, Photos, Videos
│       └── components/
└── README.md
```

## Key URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Admin Panel | http://localhost:8000/admin |
| Movies API | http://localhost:8000/api/movies/ |
| Videos API | http://localhost:8000/api/videos/ |
| Photos API | http://localhost:8000/api/photos/folders/ |

## API Examples

```bash
# Get all movies
curl http://localhost:8000/api/movies/

# Get specific movie
curl http://localhost:8000/api/movies/rrr/

# Get videos
curl http://localhost:8000/api/videos/

# Get photos
curl http://localhost:8000/api/photos/folders/
```

## Performance Tips

- Data loads with placeholders if API is slow
- Frontend caches data in state
- Images use lazy loading
- Pagination limits data (50 per page)

## Production Checklist

- [ ] Change `SECRET_KEY` in `.env`
- [ ] Set `DEBUG=False` in `.env`
- [ ] Update `ALLOWED_HOSTS` in `.env`
- [ ] Configure MySQL database properly
- [ ] Setup SSL/HTTPS
- [ ] Run `python manage.py collectstatic`
- [ ] Run `npm run build` for frontend
- [ ] Configure proper CORS origins

## Getting Help

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
3. Check Django admin at http://localhost:8000/admin
4. Review error messages in terminal

---

**🚀 You're all set! Start building!**
