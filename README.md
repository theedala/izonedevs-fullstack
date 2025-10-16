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