# Demo Credentials & Test Data

This document contains all the demo credentials and test data for Local Treasure Hunts platform.

## 🔐 Demo User Accounts

### Business Dashboard Access
- **Email**: demo@business.com
- **Password**: demo123
- **Role**: Business Owner
- **Business**: Demo Coffee Shop
- **Status**: Verified

### Mobile App Users
1. **Primary Demo User**
   - **Email**: demo@user.com
   - **Password**: demo123
   - **Role**: User
   - **Status**: Active

2. **Alice Johnson**
   - **Email**: alice@example.com
   - **Password**: demo123
   - **Role**: User
   - **Status**: Active

3. **Bob Smith**
   - **Email**: bob@example.com
   - **Password**: demo123
   - **Role**: User
   - **Status**: Active

### Admin Access
- **Email**: admin@localtreasure.app
- **Password**: admin123
- **Role**: Admin
- **Access**: Full platform administration

## 🏢 Demo Businesses

### 1. Demo Coffee Shop
- **Owner**: demo@business.com
- **Address**: 123 Market Street, San Francisco, CA 94105
- **Phone**: +1 (555) 123-4567
- **Website**: https://democoffee.com
- **Status**: Verified
- **Active Hunts**: 1

### 2. Pizza Palace
- **Owner**: pizza@example.com
- **Address**: 456 Union Square, San Francisco, CA 94108
- **Phone**: +1 (555) 234-5678
- **Status**: Verified
- **Active Hunts**: 1

### 3. Tech Bookstore
- **Owner**: books@example.com
- **Address**: 789 Mission Street, San Francisco, CA 94103
- **Phone**: +1 (555) 345-6789
- **Status**: Verified
- **Active Hunts**: 1

### 4. Fitness First Gym
- **Owner**: fitness@example.com
- **Address**: 321 Folsom Street, San Francisco, CA 94107
- **Phone**: +1 (555) 456-7890
- **Status**: Verified
- **Active Hunts**: 1

### 5. Artisan Bakery
- **Owner**: bakery@example.com
- **Address**: 654 Valencia Street, San Francisco, CA 94110
- **Phone**: +1 (555) 567-8901
- **Status**: Verified
- **Active Hunts**: 1

## 🗺️ Demo Treasure Hunts

### Demo Coffee Shop Hunt
- **Title**: Demo Coffee Shop Hunt
- **Description**: Find hidden treasures around our coffee shop and unlock exclusive rewards!
- **Status**: Active
- **Start Date**: 2025-08-01
- **End Date**: 2025-08-31
- **Loot Boxes**: 3
- **Max Claims**: 1000
- **Current Claims**: 45

#### Loot Boxes:
1. **Welcome Bonus**
   - **Location**: Near main entrance (37.7749, -122.4194)
   - **Radius**: 30 meters
   - **Reward**: 10% off first order
   - **Claims**: 15/100

2. **Free Item**
   - **Location**: Side street (37.7751, -122.4192)
   - **Radius**: 30 meters
   - **Reward**: Free coffee or pastry
   - **Claims**: 8/50

3. **Loyalty Bonus**
   - **Location**: Back alley (37.7747, -122.4196)
   - **Radius**: 30 meters
   - **Reward**: 5 loyalty points
   - **Claims**: 22/200

## 📊 Demo Analytics Data

### User Engagement
- **Total Users**: 245
- **Active Users (7 days)**: 89
- **New Users (7 days)**: 23
- **Average Session Time**: 4m 32s

### Claims Statistics
- **Total Claims**: 127
- **Claims Today**: 25
- **Claims This Week**: 89
- **Redemption Rate**: 78%

### Revenue Metrics
- **Total Revenue**: $2,847
- **Revenue Today**: $347
- **Average Order Value**: $22.40
- **Conversion Rate**: 12.3%

## 🧪 Testing Scenarios

### Mobile App Testing
1. **Login Flow**
   - Use demo@user.com / demo123
   - Verify dashboard loads correctly
   - Check profile information

2. **Treasure Discovery**
   - Enable location services
   - View map with nearby treasures
   - Navigate to loot box locations

3. **Claim Process**
   - Get within 30 meters of a loot box
   - Tap to claim treasure
   - Verify reward code generation

### Web Dashboard Testing
1. **Business Login**
   - Use demo@business.com / demo123
   - Access business dashboard
   - Review analytics and metrics

2. **Hunt Management**
   - View existing hunts
   - Create new hunt (test mode)
   - Manage loot box locations

3. **Analytics Review**
   - Check daily/weekly metrics
   - Review user engagement data
   - Export reports (if implemented)

## 🔧 Development Testing

### API Testing
- **Base URL**: http://localhost:8000/api
- **Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health

### Database Access
- **Host**: localhost
- **Port**: 5432
- **Database**: treasure_db
- **Username**: treasure_user
- **Password**: treasure_pass

### Test Commands
```bash
# Reset database with fresh demo data
cd backend && npm run db:reset

# Seed database with demo data
cd backend && npm run db:seed

# Run backend tests
cd backend && npm test

# Start all services
npm run dev
```

## 🌍 GPS Test Locations (San Francisco)

Use these coordinates for testing GPS functionality:

1. **Union Square**: 37.7880, -122.4074
2. **Fisherman's Wharf**: 37.8080, -122.4177
3. **Golden Gate Park**: 37.7694, -122.4862
4. **Mission District**: 37.7599, -122.4148
5. **Castro District**: 37.7609, -122.4350

## 📱 Mobile Testing

### iOS Testing
- Use iOS Simulator or physical device
- Install Expo Go app
- Scan QR code from `npm start` in mobile directory

### Android Testing
- Use Android Emulator or physical device
- Install Expo Go app from Play Store
- Scan QR code from `npm start` in mobile directory

## 🚨 Important Notes

- All demo passwords are intentionally simple for testing
- GPS verification can be disabled with `MOCK_GPS_VERIFICATION=true`
- Demo data is reset daily in development environment
- Production credentials should never use these demo values
- All demo businesses and users are fictional

## 🔄 Refreshing Demo Data

To refresh all demo data:

```bash
cd backend
npm run db:reset
npm run db:seed
```

This will:
1. Drop all existing data
2. Recreate database schema
3. Seed with fresh demo data
4. Reset all counters and statistics
