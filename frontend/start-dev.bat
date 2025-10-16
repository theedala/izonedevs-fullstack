@echo off
echo 🚀 Starting iZonehub Makerspace Development Servers...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating .env file...
    copy .env.example .env
)

REM Setup backend if needed
if not exist "backend\venv" (
    echo 🐍 Setting up Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    if not exist "izonedevs.db" (
        echo 📊 Creating database and seeding data...
        python create_seed_data.py
    )
    cd ..
)

echo.
echo 🎯 Starting servers...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Admin login: admin@izonedevs.com / admin123
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in background
start "iZonehub Backend" cmd /k "cd backend && venv\Scripts\activate.bat && python main.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🌐 Starting frontend...
call npm run dev

pause