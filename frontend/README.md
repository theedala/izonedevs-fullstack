# iZonehub Makerspace - Full Stack Application

A modern full-stack web application for Zimbabwe's premier innovation hub, built with React TypeScript frontend and FastAPI Python backend.

## 🚀 Quick Start

### Frontend Setup
1. **Install dependencies**: `npm install`
2. **Copy environment file**: `cp .env.example .env`
3. **Start development server**: `npm run dev`
   - Frontend will be available at `http://localhost:5173`

### Backend Setup
1. **Navigate to backend**: `cd backend`
2. **Create virtual environment**: 
   ```bash
   python -m venv venv
   venv\\Scripts\\activate  # Windows
   ```
3. **Install dependencies**: `pip install -r requirements.txt`
4. **Create uploads directory**: `mkdir uploads uploads\\images uploads\\avatars uploads\\gallery uploads\\files`
5. **Seed database**: `python create_seed_data.py`
6. **Start API server**: `python main.py`
   - API will be available at `http://localhost:8000`
   - Documentation at `http://localhost:8000/docs`

## 🔐 Default Admin Login
- **Email**: `admin@izonedevs.com`
- **Password**: `admin123`

## 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + SQLAlchemy + SQLite + JWT Authentication
- **Features**: User auth, communities, projects, events, blog, store, gallery, file uploads

## 📚 API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

Built with ❤️ for the Zimbabwe innovation community
