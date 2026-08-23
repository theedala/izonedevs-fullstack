# iZonehub Full-Stack Application

Modern makerspace platform built with FastAPI and React.

## 🏗️ Project Structure

```
izonedevs-fullstack/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
└── .do/             # Digital Ocean deployment config
```

## 🚀 Deployment

This project is configured for deployment on Digital Ocean App Platform.

### Quick Deploy
1. Push to GitHub
2. Connect to Digital Ocean App Platform
3. Deploy automatically

See `DEPLOYMENT.md` for detailed instructions.

## 🐳 Docker Compose: Full Stack and MinIO

The repository includes a Compose stack for the FastAPI API, Vite frontend, MinIO object storage, and automatic bucket initialization. Start it from the repository root with:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:4173`, the API at `http://localhost:8000`, and the MinIO console at `http://localhost:9001`. The default development credentials are `minioadmin` and `minioadmin123`; set `S3_ACCESS_KEY` and `S3_SECRET_KEY` in a root `.env` file before sharing or deploying the stack. Uploaded objects are written to the `izonedevs` bucket and served through `S3_PUBLIC_URL`.

## 💻 Local Development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 License

MIT