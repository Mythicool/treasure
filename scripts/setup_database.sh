#!/bin/bash

# Local Treasure Hunts - Database Setup Script
# This script specifically handles PostgreSQL setup and troubleshooting

set -e

echo "🐘 PostgreSQL Database Setup for Local Treasure Hunts"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for database to be ready
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    for i in {1..60}; do
        if docker exec treasure-postgres pg_isready -U treasure_user -d treasure_db >/dev/null 2>&1; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        if [ $i -eq 60 ]; then
            echo "❌ Database failed to start after 60 attempts (2 minutes)"
            return 1
        fi
        
        echo "   Attempt $i/60: Database not ready yet, waiting..."
        sleep 2
    done
}

# Function to test database connection
test_connection() {
    echo "🔍 Testing database connection..."
    if docker exec treasure-postgres psql -U treasure_user -d treasure_db -c "SELECT version();" >/dev/null 2>&1; then
        echo "✅ Database connection successful!"
        return 0
    else
        echo "❌ Database connection failed!"
        return 1
    fi
}

# Function to show container status
show_status() {
    echo "📊 Container Status:"
    echo "==================="
    
    if docker ps -a | grep -q treasure-postgres; then
        echo "Container exists:"
        docker ps -a | grep treasure-postgres
        echo ""
        
        if docker ps | grep -q treasure-postgres; then
            echo "✅ Container is running"
        else
            echo "❌ Container is stopped"
        fi
    else
        echo "❌ Container does not exist"
    fi
    
    echo ""
    echo "📋 Port 5432 status:"
    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port 5432 is in use:"
        lsof -i :5432
    else
        echo "✅ Port 5432 is available"
    fi
}

# Function to clean up and restart
cleanup_and_restart() {
    echo "🧹 Cleaning up existing container..."
    docker stop treasure-postgres 2>/dev/null || true
    docker rm treasure-postgres 2>/dev/null || true
    
    echo "🐘 Starting fresh PostgreSQL container..."
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
        return 1
    fi
    
    wait_for_db && test_connection
}

# Function to show logs
show_logs() {
    echo "📋 Container Logs (last 50 lines):"
    echo "=================================="
    docker logs --tail 50 treasure-postgres 2>/dev/null || echo "No logs available"
}

# Main script logic
main() {
    # Check prerequisites
    if ! command_exists docker; then
        echo "❌ Docker is required but not installed"
        exit 1
    fi
    
    # Check Docker daemon
    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi
    
    echo "✅ Docker is available and running"
    echo ""
    
    # Show current status
    show_status
    echo ""
    
    # Check if we need to create/start container
    if docker ps | grep -q treasure-postgres; then
        echo "✅ PostgreSQL container is already running"
        
        if test_connection; then
            echo "🎉 Database is ready to use!"
            exit 0
        else
            echo "❌ Container is running but connection failed"
            show_logs
            echo ""
            echo "🔧 Try restarting the container..."
            cleanup_and_restart
        fi
    elif docker ps -a | grep -q treasure-postgres; then
        echo "🔄 Starting existing PostgreSQL container..."
        docker start treasure-postgres
        
        if wait_for_db && test_connection; then
            echo "🎉 Database is ready to use!"
            exit 0
        else
            echo "❌ Failed to start existing container"
            show_logs
            echo ""
            echo "🔧 Creating fresh container..."
            cleanup_and_restart
        fi
    else
        echo "🆕 Creating new PostgreSQL container..."
        
        # Check if port is available
        if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "⚠️  Port 5432 is already in use:"
            lsof -i :5432
            echo ""
            echo "💡 Solutions:"
            echo "1. Stop local PostgreSQL: brew services stop postgresql (macOS)"
            echo "2. Stop local PostgreSQL: sudo systemctl stop postgresql (Linux)"
            echo "3. Use different port by editing DATABASE_URL in backend/.env"
            exit 1
        fi
        
        cleanup_and_restart
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 PostgreSQL setup complete!"
        echo ""
        echo "📝 Connection details:"
        echo "   Host: localhost"
        echo "   Port: 5432"
        echo "   Database: treasure_db"
        echo "   Username: treasure_user"
        echo "   Password: treasure_pass"
        echo ""
        echo "🔗 DATABASE_URL: postgresql://treasure_user:treasure_pass@localhost:5432/treasure_db"
        echo ""
        echo "🔧 Useful commands:"
        echo "   Test connection: docker exec -it treasure-postgres psql -U treasure_user -d treasure_db"
        echo "   View logs: docker logs treasure-postgres"
        echo "   Stop container: docker stop treasure-postgres"
        echo "   Start container: docker start treasure-postgres"
        echo ""
        echo "📚 Next steps:"
        echo "   cd backend && npx prisma generate && npx prisma db push && npm run db:seed"
    else
        echo ""
        echo "❌ PostgreSQL setup failed!"
        echo ""
        echo "🔧 Troubleshooting:"
        echo "1. Check Docker Desktop is running"
        echo "2. Check available disk space"
        echo "3. Try restarting Docker Desktop"
        echo "4. Check the troubleshooting guide: docs/database-troubleshooting.md"
        echo ""
        show_logs
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "restart")
        cleanup_and_restart
        ;;
    "test")
        test_connection
        ;;
    "clean")
        echo "🧹 Removing container and data..."
        docker stop treasure-postgres 2>/dev/null || true
        docker rm treasure-postgres 2>/dev/null || true
        docker volume rm treasure-postgres-data 2>/dev/null || true
        echo "✅ Cleanup complete"
        ;;
    *)
        main
        ;;
esac
