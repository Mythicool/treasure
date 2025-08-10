# PostgreSQL Database Troubleshooting Guide

## 🚨 Common Issue: Authentication Failed (P1000)

This guide helps resolve the PostgreSQL authentication error when running Prisma migrations.

## 🔍 Step-by-Step Troubleshooting

### 1. Check if PostgreSQL Container is Running

```bash
# Check if the container exists and is running
docker ps -a | grep treasure-postgres

# Expected output should show:
# CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                    NAMES
# abc123def456   postgres:15   "docker-entrypoint.s…"   X minutes ago    Up X minutes    0.0.0.0:5432->5432/tcp   treasure-postgres
```

### 2. Check Container Logs

```bash
# View container logs to see if there are any startup errors
docker logs treasure-postgres

# Look for lines like:
# "database system is ready to accept connections"
# "PostgreSQL init process complete; ready for start up"
```

### 3. Verify Database Connection

```bash
# Test connection using psql (if installed)
psql -h localhost -p 5432 -U treasure_user -d treasure_db

# Or using Docker exec
docker exec -it treasure-postgres psql -U treasure_user -d treasure_db

# You should be prompted for password: treasure_pass
```

### 4. Check Port Availability

```bash
# Check if port 5432 is available
lsof -i :5432

# Or check if something else is using the port
netstat -an | grep 5432
```

## 🛠️ Common Solutions

### Solution 1: Remove and Recreate Container

```bash
# Stop and remove existing container
docker stop treasure-postgres
docker rm treasure-postgres

# Remove any existing volume (this will delete data!)
docker volume rm treasure-postgres-data 2>/dev/null || true

# Recreate container with proper settings
docker run -d \
    --name treasure-postgres \
    -e POSTGRES_USER=treasure_user \
    -e POSTGRES_PASSWORD=treasure_pass \
    -e POSTGRES_DB=treasure_db \
    -p 5432:5432 \
    -v treasure-postgres-data:/var/lib/postgresql/data \
    postgres:15

# Wait for container to be ready
sleep 10

# Test connection
docker exec treasure-postgres pg_isready -U treasure_user -d treasure_db
```

### Solution 2: Use Docker Compose (Recommended)

Create a `docker-compose.dev.yml` file in the project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: treasure-postgres
    environment:
      POSTGRES_USER: treasure_user
      POSTGRES_PASSWORD: treasure_pass
      POSTGRES_DB: treasure_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U treasure_user -d treasure_db"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Solution 3: Check for Existing PostgreSQL Installation

```bash
# Check if PostgreSQL is already running on your system
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# If PostgreSQL is running locally, stop it:
brew services stop postgresql         # macOS
sudo systemctl stop postgresql        # Linux
```

### Solution 4: Use Different Port

If port 5432 is occupied, use a different port:

```bash
# Run container on port 5433
docker run -d \
    --name treasure-postgres \
    -e POSTGRES_USER=treasure_user \
    -e POSTGRES_PASSWORD=treasure_pass \
    -e POSTGRES_DB=treasure_db \
    -p 5433:5432 \
    postgres:15

# Update DATABASE_URL in backend/.env
DATABASE_URL="postgresql://treasure_user:treasure_pass@localhost:5433/treasure_db"
```

## 🔧 Quick Fix Commands

### Complete Database Reset

```bash
#!/bin/bash
# Run this script to completely reset the database

echo "🗑️  Stopping and removing existing container..."
docker stop treasure-postgres 2>/dev/null || true
docker rm treasure-postgres 2>/dev/null || true

echo "🐘 Starting fresh PostgreSQL container..."
docker run -d \
    --name treasure-postgres \
    -e POSTGRES_USER=treasure_user \
    -e POSTGRES_PASSWORD=treasure_pass \
    -e POSTGRES_DB=treasure_db \
    -p 5432:5432 \
    postgres:15

echo "⏳ Waiting for database to be ready..."
sleep 15

echo "🔍 Testing connection..."
docker exec treasure-postgres pg_isready -U treasure_user -d treasure_db

if [ $? -eq 0 ]; then
    echo "✅ Database is ready!"
    echo "🔄 Running Prisma commands..."
    cd backend
    npx prisma generate
    npx prisma db push
    npm run db:seed
    echo "✅ Database setup complete!"
else
    echo "❌ Database is not ready. Check logs:"
    docker logs treasure-postgres
fi
```

### Manual Connection Test

```bash
# Test connection manually
docker exec -it treasure-postgres psql -U treasure_user -d treasure_db -c "SELECT version();"

# Expected output:
# PostgreSQL 15.x on x86_64-pc-linux-gnu...
```

## 🐛 Advanced Debugging

### Check Container Environment Variables

```bash
docker exec treasure-postgres env | grep POSTGRES
```

### Check Database Users

```bash
docker exec -it treasure-postgres psql -U treasure_user -d treasure_db -c "\du"
```

### Check Database List

```bash
docker exec -it treasure-postgres psql -U treasure_user -d treasure_db -c "\l"
```

### View Container Resource Usage

```bash
docker stats treasure-postgres
```

## 🚨 Emergency Recovery

If nothing works, use this nuclear option:

```bash
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all volumes (WARNING: This deletes all data!)
docker volume prune -f

# Remove all networks
docker network prune -f

# Start fresh
./scripts/bootstrap_local.sh
```

## 📞 Getting Help

If you're still having issues:

1. Check Docker Desktop is running
2. Restart Docker Desktop
3. Check available disk space
4. Check Docker logs: `docker logs treasure-postgres`
5. Try running on a different port
6. Use the improved bootstrap script provided

## ✅ Verification Checklist

- [ ] Docker is running
- [ ] Port 5432 is available
- [ ] Container is running: `docker ps | grep treasure-postgres`
- [ ] Container is healthy: `docker exec treasure-postgres pg_isready`
- [ ] Connection works: `docker exec -it treasure-postgres psql -U treasure_user -d treasure_db`
- [ ] Environment variables are correct in `backend/.env`
- [ ] Prisma can connect: `cd backend && npx prisma db push`
