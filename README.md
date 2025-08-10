# Local Treasure Hunts

A production-ready platform for GPS-based treasure hunting experiences where businesses create location-based loot boxes that users can discover and unlock for real rewards.

## 🎯 Overview

Local Treasure Hunts enables businesses to create engaging location-based marketing campaigns through GPS treasure hunts. Users explore their city to find virtual loot boxes and unlock real rewards like discounts, free items, or exclusive offers.

## 🏗️ Architecture

This is a mono-repo containing:

- **mobile/** - React Native + Expo mobile app (iOS & Android)
- **web/** - React + TypeScript business dashboard
- **backend/** - Node.js + TypeScript API with PostgreSQL
- **landing/** - Marketing landing page
- **infra/** - Infrastructure as code (Terraform/CloudFormation)
- **docs/** - Documentation and guides

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- Expo CLI (`npm install -g @expo/cli`)

### One-Command Setup

```bash
./scripts/bootstrap_local.sh
```

This will:
1. Install all dependencies
2. Set up the database
3. Run migrations and seed data
4. Start all development servers

### Manual Setup

1. **Clone and install dependencies:**
```bash
git clone <repo-url>
cd treasure
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup:**
```bash
cd backend
npm run db:setup
npm run db:migrate
npm run db:seed
```

4. **Start development servers:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Web Dashboard
cd web && npm run dev

# Terminal 3 - Mobile App
cd mobile && npm start

# Terminal 4 - Landing Page
cd landing && npm run dev
```

## 📱 Mobile App

- **iOS**: Scan QR code with Camera app
- **Android**: Scan QR code with Expo Go app
- **Production builds**: See `mobile/README.md`

## 🌐 Web Dashboard

Access the business dashboard at `http://localhost:3000`

Demo credentials:
- Email: `demo@business.com`
- Password: `demo123`

## 🔧 API Documentation

Interactive API docs available at `http://localhost:8000/api/docs`

## 🚢 Deployment

### One-Command Deploy

```bash
./scripts/deploy_all.sh
```

### Manual Deployment

See individual README files in each directory for specific deployment instructions.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Backend tests
cd backend && npm test

# Web tests
cd web && npm test

# E2E tests
npm run test:e2e
```

## 📊 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Mobile**: React Native, Expo
- **Backend**: Node.js, NestJS, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: Mapbox
- **Auth**: Firebase Auth
- **Payments**: Stripe
- **Deployment**: Vercel (frontend), AWS ECS (backend)
- **CI/CD**: GitHub Actions

## 🔐 Security

- JWT-based authentication with refresh tokens
- Server-side claim verification
- Rate limiting on sensitive endpoints
- Anti-spoofing checks for GPS claims
- Secure secret management

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

See CONTRIBUTING.md for development guidelines.

## 📞 Support

For issues and questions, please use GitHub Issues or contact support@localtreasure.app
