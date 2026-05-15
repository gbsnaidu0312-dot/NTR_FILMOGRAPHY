# NTR Filmography - Complete Setup Guide

Welcome to **NTR Filmography**, a cinematic fan website dedicated to Jr. NTR (N.T. Rama Rao Jr.), a celebrated Indian actor. This is a full-stack web application built with Django REST Framework and React.

## 📋 Project Overview

- **Backend**: Django 4.2 + Django REST Framework
- **Frontend**: React 18 + Vite + TailwindCSS
- **Database**: MySQL
- **Real-time Updates**: REST API with pagination and filtering
- **Styling**: Dark cinematic theme with gold accents

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- MySQL Server (or MariaDB)
- Git

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env

# 6. Configure database in .env
# Update DB_NAME, DB_USER, DB_PASSWORD as per your MySQL setup

# 7. Run migrations
python manage.py migrate

# 8. Create superuser (admin account)
python manage.py createsuperuser

# 9. Seed sample data
python manage.py shell < scripts/seed_movies.py

# 10. Start development server
python manage.py runserver
```

The backend will be available at: **http://localhost:8000**
Admin panel: **http://localhost:8000/admin**

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## 📁 Project Structure

```
ntr-filmography/
├── backend/
│   ├── config/              # Django settings
│   ├── apps/
│   │   ├── core/           # Core app with router
│   │   ├── movies/         # Movie management
│   │   ├── videos/         # Video management
│   │   ├── audio/          # Audio songs
│   │   └── photos/         # Photo galleries
│   ├── scripts/
│   │   └── seed_movies.py  # Sample data script
│   ├── tools/
│   │   ├── postman_collection.json
│   │   └── curl_examples.sh
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md               # This file
```

## 🔧 Configuration

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=ntr_filmography
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Cloudflare R2 (Optional)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_R2_BUCKET=ntr-filmography
CLOUDFLARE_R2_ENDPOINT=
```

### Frontend (.env - optional)

Create a `.env.local` in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## 📊 Database Setup

### Create MySQL Database

```sql
CREATE DATABASE ntr_filmography;
CREATE USER 'ntr_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON ntr_filmography.* TO 'ntr_user'@'localhost';
FLUSH PRIVILEGES;
```

Or use the default root user with no password (development only).

## 🗂️ API Endpoints

### Movies
- `GET /api/movies/` - List all movies
- `GET /api/movies/{slug}/` - Get movie details
- `GET /api/movies/{slug}/video-cuts/` - Get video cuts
- `GET /api/movies/{slug}/video-songs/` - Get video songs
- `GET /api/movies/{slug}/audio-songs/` - Get audio songs

### Videos
- `GET /api/videos/` - List all videos
- `GET /api/videos/?type=cut` - Filter by type
- `GET /api/videos/{id}/` - Get video details

### Audio Songs
- `GET /api/audio-songs/` - List all songs
- `GET /api/audio-songs/{id}/` - Get song details

### Photos
- `GET /api/photos/folders/` - List photo folders
- `GET /api/photos/folders/?type=movie` - Filter folders by type
- `GET /api/photos/folders/{slug}/` - Get folder with photos
- `GET /api/photos/` - List all photos
- `GET /api/photos/?folder={id}` - Get photos by folder

## 🧪 Testing the API

### Using cURL

```bash
# Get all movies
curl http://localhost:8000/api/movies/

# Get specific movie
curl http://localhost:8000/api/movies/rrr/

# Get videos by type
curl http://localhost:8000/api/videos/?type=cut
```

### Using Postman

1. Import `backend/tools/postman_collection.json` into Postman
2. All endpoints are pre-configured and ready to test

### Using Browser

Simply navigate to the endpoints in your browser:
- http://localhost:8000/api/movies/
- http://localhost:8000/api/videos/
- http://localhost:8000/api/photos/folders/

## 🎨 Frontend Features

### Home Page
- Hero section with animated floating cards
- Navigation to Movies, Photos, and Videos sections
- Statistics display

### Movies Page
- **Filmstrip View**: Vertical scroll with landscape banners
- **Grid View**: All movies in a 4-column grid
- **Navigation**: Previous/Next with movie count
- **Animations**: Smooth transitions and hover effects

### Movie Details Page
- Movie banner and information
- Netflix-style tabs:
  - Video Cuts
  - Video Songs
  - Audio Songs
- Action buttons (Play, Download, Share)
- Sticky tab navigation

### Photos Page
- Folder categories: Movies, Events, Offline
- Click folder to view gallery
- Image viewer with previous/next navigation
- Full-screen viewing option

### Videos Page
- **Events & Ads** section
- **Celebrations** section
- Netflix-style grid
- Play, download, and share buttons
- Hover animations

## 🚀 Deployment

### Backend (Django)

```bash
# Build for production
python manage.py collectstatic

# Use Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (React)

```bash
# Build for production
npm run build

# Deploy the 'dist' folder to your hosting
```

## 📦 Dependencies

### Backend
```
Django==4.2.14
djangorestframework==3.14.0
django-cors-headers==4.3.1
mysqlclient==2.2.0
Pillow==10.0.0
python-decouple==3.8
```

### Frontend
```
react@^18.2.0
react-router-dom@^6.20.1
axios@^1.6.2
framer-motion@^10.16.4
tailwindcss@^3.3.6
```

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure CORS for your domain

## 🐛 Troubleshooting

### "No such table" error
```bash
python manage.py migrate
```

### MySQL connection error
- Verify MySQL is running
- Check DB credentials in .env
- Ensure database exists: `CREATE DATABASE ntr_filmography;`

### Frontend can't connect to API
- Check backend is running: `http://localhost:8000/api/movies/`
- Verify CORS settings in `backend/config/settings.py`
- Check browser console for CORS errors

### Module not found (frontend)
```bash
cd frontend
npm install
npm run dev
```

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 👨‍💻 Development Tips

### Hot Reload
Both frontend (Vite) and backend (Django) support auto-reload during development. Just save your files!

### API Testing
Use the included Postman collection or cURL commands to test endpoints before building UI components.

### Database Browsing
Access Django Admin at `http://localhost:8000/admin` to view and manage data directly.

### Component Reusability
Common components are in `frontend/src/components/Common.jsx`:
- `LoadingSpinner`
- `PlaceholderCard`
- `ToastNotification`
- `VideoPlayer`
- `AudioPlayer`

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- Built with ❤️ for Jr. NTR fans
- Inspired by modern streaming platforms UI/UX
- Special thanks to the Django and React communities

---

**Happy coding! Enjoy building your NTR Filmography experience!** 🎬🐯
