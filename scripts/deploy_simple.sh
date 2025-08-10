#!/bin/bash

# Simplified Production Deployment Script
# Uses Vercel for all deployments and provides manual database setup instructions

set -e

echo "🚀 Local Treasure Hunts - Simplified Production Deployment"
echo "=========================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Deploy Backend to Vercel
deploy_backend() {
    print_status "Deploying backend to Vercel..."
    
    cd backend
    
    # Build the application
    print_status "Building backend application..."
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    npx vercel --prod --yes --name="treasure-hunts-api"
    
    # Get the deployment URL
    BACKEND_URL=$(npx vercel ls | grep treasure-hunts-api | head -1 | awk '{print $2}')
    if [ -z "$BACKEND_URL" ]; then
        BACKEND_URL="https://treasure-hunts-api.vercel.app"
    fi
    
    print_success "Backend deployed to: $BACKEND_URL"
    
    cd ..
    
    # Save backend URL
    echo "BACKEND_URL=$BACKEND_URL" > .env.deployment
}

# Deploy Web Dashboard
deploy_web() {
    print_status "Deploying web dashboard to Vercel..."
    
    cd web
    
    # Load backend URL
    source ../.env.deployment
    
    # Create production environment file
    cat > .env.production << EOF
VITE_API_BASE_URL=$BACKEND_URL/api
VITE_APP_NAME="Local Treasure Hunts"
VITE_APP_VERSION="1.0.0"
EOF
    
    # Build the application
    print_status "Building web dashboard..."
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    npx vercel --prod --yes --name="treasure-hunts-dashboard"
    
    # Get the deployment URL
    WEB_URL=$(npx vercel ls | grep treasure-hunts-dashboard | head -1 | awk '{print $2}')
    if [ -z "$WEB_URL" ]; then
        WEB_URL="https://treasure-hunts-dashboard.vercel.app"
    fi
    
    print_success "Web dashboard deployed to: $WEB_URL"
    
    cd ..
    
    # Update deployment environment
    echo "WEB_URL=$WEB_URL" >> .env.deployment
}

# Deploy Landing Page
deploy_landing() {
    print_status "Deploying landing page to Vercel..."
    
    cd landing
    
    # Load URLs
    source ../.env.deployment
    
    # Create production environment file
    cat > .env.production << EOF
VITE_API_BASE_URL=$BACKEND_URL/api
VITE_DASHBOARD_URL=$WEB_URL
VITE_APP_NAME="Local Treasure Hunts"
EOF
    
    # Build the application
    print_status "Building landing page..."
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    npx vercel --prod --yes --name="treasure-hunts-landing"
    
    # Get the deployment URL
    LANDING_URL=$(npx vercel ls | grep treasure-hunts-landing | head -1 | awk '{print $2}')
    if [ -z "$LANDING_URL" ]; then
        LANDING_URL="https://treasure-hunts-landing.vercel.app"
    fi
    
    print_success "Landing page deployed to: $LANDING_URL"
    
    cd ..
    
    # Update deployment environment
    echo "LANDING_URL=$LANDING_URL" >> .env.deployment
}

# Build Mobile App
build_mobile() {
    print_status "Building mobile application..."
    
    cd mobile
    
    # Load backend URL
    source ../.env.deployment
    
    # Update app configuration
    cat > app.config.js << EOF
export default {
  expo: {
    name: "Local Treasure Hunts",
    slug: "local-treasure-hunts",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "treasurehunts",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6366f1"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.localtreasure.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6366f1"
      },
      package: "com.localtreasure.app"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-barcode-scanner",
      "expo-camera",
      "expo-location"
    ],
    extra: {
      apiBaseUrl: "$BACKEND_URL/api"
    }
  }
};
EOF
    
    # Build for web (preview)
    print_status "Building mobile app for web preview..."
    npx expo export --platform web
    
    print_warning "Mobile app builds require EAS CLI and account setup"
    print_warning "To build mobile apps:"
    print_warning "1. Install EAS CLI: npm install -g @expo/eas-cli"
    print_warning "2. Login to Expo: npx eas login"
    print_warning "3. Configure builds: npx eas build:configure"
    print_warning "4. Build Android: npx eas build --platform android"
    print_warning "5. Build iOS: npx eas build --platform ios"
    
    cd ..
}

# Show database setup instructions
show_database_instructions() {
    print_status "Database Setup Instructions"
    echo "=============================="
    echo ""
    echo "Since Railway has resource limits, please set up a free PostgreSQL database manually:"
    echo ""
    echo "Option 1: Supabase (Recommended)"
    echo "1. Go to https://supabase.com"
    echo "2. Create a new project"
    echo "3. Go to Settings > Database"
    echo "4. Copy the connection string"
    echo "5. Set DATABASE_URL environment variable in Vercel"
    echo ""
    echo "Option 2: Neon"
    echo "1. Go to https://neon.tech"
    echo "2. Create a new project"
    echo "3. Copy the connection string"
    echo "4. Set DATABASE_URL environment variable in Vercel"
    echo ""
    echo "Option 3: PlanetScale"
    echo "1. Go to https://planetscale.com"
    echo "2. Create a new database"
    echo "3. Create a connection string"
    echo "4. Set DATABASE_URL environment variable in Vercel"
    echo ""
    echo "After setting up the database:"
    echo "1. Update the DATABASE_URL in Vercel dashboard"
    echo "2. Redeploy the backend: cd backend && npx vercel --prod"
    echo "3. Run migrations manually or through Vercel functions"
    echo ""
}

# Main deployment
main() {
    print_status "Starting simplified deployment..."
    
    # Check if Vercel CLI is available
    if ! command -v npx &> /dev/null; then
        print_error "npm/npx is required but not installed"
        exit 1
    fi
    
    # Deploy components
    deploy_backend
    deploy_web
    deploy_landing
    build_mobile
    
    # Load final URLs
    source .env.deployment
    
    print_success "Deployment completed!"
    echo ""
    echo "🌐 Deployed URLs:"
    echo "=================="
    echo "🔧 Backend API:      $BACKEND_URL"
    echo "💼 Web Dashboard:    $WEB_URL"
    echo "🏠 Landing Page:     $LANDING_URL"
    echo "📱 Mobile App:       Web build in mobile/dist"
    echo ""
    
    show_database_instructions
    
    echo ""
    echo "🔧 Next Steps:"
    echo "=============="
    echo "1. Set up a PostgreSQL database (see instructions above)"
    echo "2. Configure DATABASE_URL in Vercel dashboard"
    echo "3. Test all deployed services"
    echo "4. Set up custom domains (optional)"
    echo "5. Build and distribute mobile apps"
    echo ""
    echo "🔗 Useful Links:"
    echo "================"
    echo "Vercel Dashboard: https://vercel.com/dashboard"
    echo "Supabase: https://supabase.com"
    echo "Neon: https://neon.tech"
    echo "Expo Dashboard: https://expo.dev"
}

# Handle command line arguments
case "${1:-}" in
    "backend")
        deploy_backend
        ;;
    "web")
        deploy_web
        ;;
    "landing")
        deploy_landing
        ;;
    "mobile")
        build_mobile
        ;;
    "db-info")
        show_database_instructions
        ;;
    *)
        main
        ;;
esac
