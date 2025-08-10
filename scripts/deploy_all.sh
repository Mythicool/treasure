#!/bin/bash

# Local Treasure Hunts - Deployment Script
# This script deploys all components to production

set -e

echo "🚀 Starting Local Treasure Hunts deployment..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Deployment must be done from the main branch. Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ There are uncommitted changes. Please commit or stash them before deploying."
    exit 1
fi

# Build all projects
echo "🔨 Building all projects..."

# Build backend
echo "📦 Building backend..."
cd backend
npm run build
cd ..

# Build web dashboard
echo "🌐 Building web dashboard..."
cd web
npm run build
cd ..

# Build landing page
echo "🏠 Building landing page..."
cd landing
npm run build
cd ..

# Build mobile app for production
echo "📱 Building mobile app..."
cd mobile
if command -v eas &> /dev/null; then
    echo "Building with EAS..."
    # eas build --platform all --profile production --non-interactive
    echo "EAS build would run here (requires EAS setup)"
else
    echo "Building web version..."
    npx expo export --platform web
fi
cd ..

echo "✅ All builds completed successfully"

# Deploy backend to AWS ECS (placeholder)
echo "🚀 Deploying backend to AWS ECS..."
echo "Backend deployment would happen here"
# Add actual AWS ECS deployment commands

# Deploy web dashboard to Vercel
echo "🌐 Deploying web dashboard to Vercel..."
if command -v vercel &> /dev/null; then
    cd web
    vercel --prod --yes
    cd ..
else
    echo "Vercel CLI not found. Install with: npm i -g vercel"
    echo "Then run: cd web && vercel --prod"
fi

# Deploy landing page to Vercel
echo "🏠 Deploying landing page to Vercel..."
if command -v vercel &> /dev/null; then
    cd landing
    vercel --prod --yes
    cd ..
else
    echo "Vercel CLI not found. Install with: npm i -g vercel"
    echo "Then run: cd landing && vercel --prod"
fi

# Deploy mobile app to app stores (placeholder)
echo "📱 Deploying mobile app to app stores..."
echo "Mobile app store deployment would happen here"
# Add actual app store deployment commands

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📱 Mobile App:"
echo "- Android: Check EAS build dashboard for APK"
echo "- iOS: Check EAS build dashboard for IPA"
echo ""
echo "🌐 Web Applications:"
echo "- Landing Page: Check Vercel dashboard for URL"
echo "- Business Dashboard: Check Vercel dashboard for URL"
echo ""
echo "🔧 Backend:"
echo "- API: Check AWS ECS dashboard for status"
echo "- Database: Check AWS RDS dashboard"
echo ""
echo "📊 Monitoring:"
echo "- Check application logs and metrics"
echo "- Verify all health checks are passing"
echo "- Test critical user flows"
echo ""
