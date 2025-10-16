#!/bin/bash

# iZonehub Makerspace Backend Setup Script

echo "🚀 Setting up iZonehub Makerspace Backend..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "⚡ Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Copy environment file
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads/{images,avatars,gallery,files}

echo "✅ Backend setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database and secret key"
echo "2. Run: python seed_data.py (to populate sample data)"
echo "3. Run: python main.py (to start the server)"
echo ""
echo "API will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"