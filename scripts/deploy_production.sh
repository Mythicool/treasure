#!/bin/bash

# Local Treasure Hunts - Production Deployment Script
# This script deploys the entire application stack to production

set -e

echo "🚀 Starting Local Treasure Hunts Production Deployment"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Deploy Backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    cd backend
    
    # Build the application
    print_status "Building backend application..."
    npm run build
    
    # Initialize Railway project if not exists
    if [ ! -f ".railway" ]; then
        print_status "Initializing Railway project..."
        npx railway login
        npx railway init
    fi
    
    # Add PostgreSQL database
    print_status "Adding PostgreSQL database..."
    npx railway add --database postgresql
    
    # Deploy the backend
    print_status "Deploying backend service..."
    npx railway up
    
    # Get the deployment URL
    BACKEND_URL=$(npx railway domain)
    print_success "Backend deployed to: $BACKEND_URL"
    
    cd ..
    
    # Save backend URL for frontend deployments
    echo "BACKEND_URL=$BACKEND_URL" > .env.deployment
}

# Deploy Web Dashboard to Vercel
deploy_web_dashboard() {
    print_status "Deploying web dashboard to Vercel..."
    
    cd web
    
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
    npx vercel --prod --yes
    
    # Get the deployment URL
    WEB_URL=$(npx vercel ls --scope=team | grep web | head -1 | awk '{print $2}')
    print_success "Web dashboard deployed to: $WEB_URL"
    
    cd ..
    
    # Update deployment environment
    echo "WEB_URL=$WEB_URL" >> .env.deployment
}

# Deploy Landing Page to Vercel
deploy_landing_page() {
    print_status "Deploying landing page to Vercel..."
    
    cd landing
    
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
    npx vercel --prod --yes
    
    # Get the deployment URL
    LANDING_URL=$(npx vercel ls --scope=team | grep landing | head -1 | awk '{print $2}')
    print_success "Landing page deployed to: $LANDING_URL"
    
    cd ..
    
    # Update deployment environment
    echo "LANDING_URL=$LANDING_URL" >> .env.deployment
}

# Build Mobile App
build_mobile_app() {
    print_status "Building mobile application..."
    
    cd mobile
    
    # Update app.json with production API URL
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
    
    # Build APK for Android
    if command -v eas &> /dev/null; then
        print_status "Building Android APK..."
        npx eas build --platform android --profile preview --non-interactive
        
        print_status "Building iOS IPA..."
        npx eas build --platform ios --profile preview --non-interactive
    else
        print_warning "EAS CLI not found. Install with: npm install -g @expo/eas-cli"
        print_warning "Mobile app builds will be skipped"
    fi
    
    cd ..
}

# Update CORS settings
update_cors_settings() {
    print_status "Updating CORS settings..."
    
    # Update backend CORS configuration
    cd backend
    
    # Set environment variables on Railway
    npx railway variables set CORS_ORIGIN="$LANDING_URL,$WEB_URL"
    
    cd ..
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd backend
    
    # Run migrations on Railway
    npx railway run npx prisma db push
    npx railway run npm run db:seed
    
    cd ..
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Load deployment environment if exists
    if [ -f ".env.deployment" ]; then
        source .env.deployment
    fi
    
    check_dependencies
    
    # Deploy in order
    deploy_backend
    source .env.deployment  # Reload to get BACKEND_URL
    
    deploy_web_dashboard
    source .env.deployment  # Reload to get WEB_URL
    
    deploy_landing_page
    source .env.deployment  # Reload to get LANDING_URL
    
    update_cors_settings
    run_migrations
    build_mobile_app
    
    print_success "Deployment completed successfully!"
    echo ""
    echo "🌐 Deployed URLs:"
    echo "=================="
    echo "🔧 Backend API:      $BACKEND_URL"
    echo "💼 Web Dashboard:    $WEB_URL"
    echo "🏠 Landing Page:     $LANDING_URL"
    echo "📱 Mobile App:       Check EAS dashboard for builds"
    echo ""
    echo "📚 Next Steps:"
    echo "=============="
    echo "1. Test all deployed services"
    echo "2. Configure custom domains (optional)"
    echo "3. Set up monitoring and alerts"
    echo "4. Submit mobile apps to app stores"
    echo ""
    echo "🔧 Useful Commands:"
    echo "==================="
    echo "Railway logs:        cd backend && npx railway logs"
    echo "Vercel logs:         npx vercel logs [deployment-url]"
    echo "Redeploy backend:    cd backend && npx railway up"
    echo "Redeploy frontend:   cd web && npx vercel --prod"
}

# Handle command line arguments
case "${1:-}" in
    "backend")
        deploy_backend
        ;;
    "web")
        deploy_web_dashboard
        ;;
    "landing")
        deploy_landing_page
        ;;
    "mobile")
        build_mobile_app
        ;;
    "cors")
        update_cors_settings
        ;;
    "migrate")
        run_migrations
        ;;
    *)
        main
        ;;
esac
