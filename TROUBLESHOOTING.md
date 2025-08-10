# 🚨 Database Authentication Error - Quick Fix Guide

## The Problem
You're seeing this error:
```
Error: P1000: Authentication failed against database server at `localhost`, 
the provided database credentials for `treasure_user` are not valid.
```

## 🚀 Quick Fix (One Command)

```bash
./scripts/setup_database.sh
```

This script will automatically:
- Check if PostgreSQL container exists
- Start or recreate the container with correct credentials
- Wait for database to be ready
- Test the connection
- Provide troubleshooting if it fails

## 🔍 Step-by-Step Manual Fix

### 1. Check Current Status
```bash
# Check if container is running
docker ps | grep treasure-postgres

# Check container logs
docker logs treasure-postgres

# Check what's using port 5432
lsof -i :5432
```

### 2. Clean Restart (Most Common Solution)
```bash
# Stop and remove existing container
docker stop treasure-postgres
docker rm treasure-postgres

# Start fresh container
docker run -d \
    --name treasure-postgres \
    -e POSTGRES_USER=treasure_user \
    -e POSTGRES_PASSWORD=treasure_pass \
    -e POSTGRES_DB=treasure_db \
    -p 5432:5432 \
    postgres:15

# Wait for it to be ready (30 seconds)
sleep 30

# Test connection
docker exec treasure-postgres pg_isready -U treasure_user -d treasure_db
```

### 3. Test Database Connection
```bash
# Using our test script
cd backend && npm run db:test

# Or manually
docker exec -it treasure-postgres psql -U treasure_user -d treasure_db
```

### 4. Run Prisma Commands
```bash
cd backend
npx prisma generate
npx prisma db push
npm run db:seed
```

## 🛠️ Alternative Solutions

### Solution A: Use Different Port
If port 5432 is occupied:

```bash
# Use port 5433 instead
docker run -d \
    --name treasure-postgres \
    -e POSTGRES_USER=treasure_user \
    -e POSTGRES_PASSWORD=treasure_pass \
    -e POSTGRES_DB=treasure_db \
    -p 5433:5432 \
    postgres:15

# Update backend/.env
DATABASE_URL="postgresql://treasure_user:treasure_pass@localhost:5433/treasure_db"
```

### Solution B: Stop Local PostgreSQL
If you have PostgreSQL running locally:

```bash
# macOS
brew services stop postgresql

# Linux
sudo systemctl stop postgresql

# Windows
net stop postgresql-x64-14
```

### Solution C: Use Docker Compose
```bash
# Create docker-compose.dev.yml in project root
cat > docker-compose.dev.yml << EOF
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
volumes:
  postgres_data:
EOF

# Start with Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

## 🔧 Diagnostic Commands

### Check Container Status
```bash
./scripts/setup_database.sh status
```

### View Container Logs
```bash
./scripts/setup_database.sh logs
```

### Test Connection Only
```bash
./scripts/setup_database.sh test
```

### Complete Clean Restart
```bash
./scripts/setup_database.sh restart
```

### Nuclear Option (Deletes All Data)
```bash
./scripts/setup_database.sh clean
```

## 📋 Verification Checklist

After fixing, verify everything works:

- [ ] Container is running: `docker ps | grep treasure-postgres`
- [ ] Connection works: `cd backend && npm run db:test`
- [ ] Prisma connects: `cd backend && npx prisma db push`
- [ ] Seeding works: `cd backend && npm run db:seed`
- [ ] Backend starts: `cd backend && npm run dev`

## 🆘 Still Having Issues?

### Check These Common Causes:

1. **Docker not running**: Start Docker Desktop
2. **Port conflict**: Something else using port 5432
3. **Insufficient permissions**: Run with sudo (Linux)
4. **Disk space**: Check available disk space
5. **Network issues**: Check firewall settings

### Get More Help:

1. **Detailed troubleshooting**: `docs/database-troubleshooting.md`
2. **Container logs**: `docker logs treasure-postgres`
3. **System logs**: Check Docker Desktop logs
4. **Environment check**: Verify `backend/.env` file

### Emergency Contact:
If nothing works, create a GitHub issue with:
- Your operating system
- Docker version: `docker --version`
- Error logs: `docker logs treasure-postgres`
- Output of: `./scripts/setup_database.sh status`

## 🎯 Expected Working State

When everything is working correctly:

```bash
$ docker ps | grep treasure-postgres
abc123  postgres:15  "docker-entrypoint.s…"  Up 2 minutes  0.0.0.0:5432->5432/tcp  treasure-postgres

$ cd backend && npm run db:test
🔍 Testing PostgreSQL Connection...
✅ Connection successful!
🎉 All database tests passed!

$ cd backend && npx prisma db push
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "treasure_db", schema "public" at "localhost:5432"

🚀 Your database is now in sync with your schema.
```

---

**💡 Pro Tip**: Bookmark this file and the `./scripts/setup_database.sh` command for quick database troubleshooting!
