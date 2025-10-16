@echo off
REM iZonehub Makerspace Backend Setup Script for Windows

echo 🚀 Setting up iZonehub Makerspace Backend...

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo ⚡ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Copy environment file
echo 🔧 Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration
)

REM Create uploads directory
echo 📁 Creating uploads directory...
mkdir uploads\images 2>nul
mkdir uploads\avatars 2>nul
mkdir uploads\gallery 2>nul
mkdir uploads\files 2>nul

echo ✅ Backend setup completed!
echo.
echo Next steps:
echo 1. Edit .env file with your database and secret key
echo 2. Run: python seed_data.py (to populate sample data)
echo 3. Run: python main.py (to start the server)
echo.
echo API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs

pause