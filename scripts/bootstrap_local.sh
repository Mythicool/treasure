#!/bin/bash

# Local Treasure Hunts - Bootstrap Script
# This script sets up the entire development environment

set -e

echo "🚀 Starting Local Treasure Hunts bootstrap..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ and try again."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed. Please install Docker and try again."
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed. Please install Git and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
npm install

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp ../.env.example .env
fi

# Check if PostgreSQL container already exists
if docker ps -a | grep -q treasure-postgres; then
    echo "🔍 Found existing PostgreSQL container..."

    # Check if it's running
    if docker ps | grep -q treasure-postgres; then
        echo "✅ PostgreSQL container is already running"
    else
        echo "🔄 Starting existing PostgreSQL container..."
        docker start treasure-postgres
    fi
else
    echo "🐘 Creating new PostgreSQL database container..."

    # Check if port 5432 is available
    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port 5432 is already in use. Checking what's using it..."
        lsof -i :5432
        echo ""
        echo "❌ Please stop the service using port 5432 or use a different port."
        echo "   To stop local PostgreSQL: brew services stop postgresql (macOS) or sudo systemctl stop postgresql (Linux)"
        exit 1
    fi

    # Remove any existing container with the same name
    docker rm -f treasure-postgres 2>/dev/null || true

    # Create and start PostgreSQL container
    docker run -d \
        --name treasure-postgres \
        -e POSTGRES_USER=treasure_user \
        -e POSTGRES_PASSWORD=treasure_pass \
        -e POSTGRES_DB=treasure_db \
        -p 5432:5432 \
        -v treasure-postgres-data:/var/lib/postgresql/data \
        postgres:15

    if [ $? -ne 0 ]; then
        echo "❌ Failed to start PostgreSQL container"
        exit 1
    fi
fi

# Wait for database to be ready with proper health check
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
    if docker exec treasure-postgres pg_isready -U treasure_user -d treasure_db >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi

    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start after 30 attempts"
        echo "📋 Container logs:"
        docker logs treasure-postgres
        exit 1
    fi

    echo "   Attempt $i/30: Database not ready yet, waiting..."
    sleep 2
done

# Test database connection
echo "🔍 Testing database connection..."
if ! docker exec treasure-postgres psql -U treasure_user -d treasure_db -c "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ Database connection test failed"
    echo "📋 Container logs:"
    docker logs treasure-postgres
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "1. Check if container is running: docker ps | grep treasure-postgres"
    echo "2. Check container logs: docker logs treasure-postgres"
    echo "3. Try manual connection: docker exec -it treasure-postgres psql -U treasure_user -d treasure_db"
    echo "4. See docs/database-troubleshooting.md for more help"
    exit 1
fi

echo "✅ Database connection successful!"

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗃️  Running database migrations..."
npx prisma db push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Backend setup complete"

cd ..

# Setup web dashboard
echo "🌐 Setting up web dashboard..."
cd web
npm install
echo "✅ Web dashboard setup complete"

cd ..

# Setup landing page
echo "🏠 Setting up landing page..."
cd landing
npm install
echo "✅ Landing page setup complete"

cd ..

# Setup mobile app
echo "📱 Setting up mobile app..."
cd mobile

# Install mobile dependencies
npm install

# Install Expo CLI globally if not present
if ! command -v expo &> /dev/null; then
    echo "📲 Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo "✅ Mobile app setup complete"

cd ..

echo ""
echo "🎉 Bootstrap complete! Your Local Treasure Hunts development environment is ready."
echo ""
echo "📚 Next steps:"
echo "1. Start the backend:     cd backend && npm run dev"
echo "2. Start the web app:     cd web && npm run dev"
echo "3. Start the mobile app:  cd mobile && npm start"
echo "4. Start the landing:     cd landing && npm run dev"
echo ""
echo "🌐 URLs:"
echo "- Backend API:      http://localhost:8000"
echo "- API Docs:         http://localhost:8000/api/docs"
echo "- Web Dashboard:    http://localhost:3000"
echo "- Landing Page:     http://localhost:5173"
echo "- Mobile App:       Scan QR code with Expo Go"
echo ""
echo "📧 Demo credentials:"
echo "- Business: demo@business.com / demo123"
echo "- User: demo@user.com / demo123"
echo ""
echo "🔧 Useful commands:"
echo "- npm run dev          # Start all services"
echo "- npm run build        # Build all projects"
echo "- npm run test         # Run all tests"
echo "- npm run db:reset     # Reset database"
echo ""
