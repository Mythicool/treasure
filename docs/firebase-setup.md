# Firebase Configuration Guide

## Current Status: Firebase Disabled for Local Development

The Local Treasure Hunts backend is currently configured to run without Firebase authentication for local development. This allows you to test the application without setting up Firebase credentials.

## Local Development Configuration

### Environment Variables (backend/.env)
```bash
DISABLE_FIREBASE="true"
```

When `DISABLE_FIREBASE=true`, the application will:
- Skip Firebase initialization
- Use local JWT authentication only
- Log: "🔥 Firebase disabled via DISABLE_FIREBASE=true - running in local development mode"

## Setting Up Firebase for Production

When you're ready to enable Firebase authentication for production, follow these steps:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication service
4. Configure sign-in methods (Email/Password, Google, etc.)

### 2. Generate Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values from the JSON:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### 3. Update Environment Variables

Replace the placeholder values in `backend/.env`:

```bash
# Remove or set to false to enable Firebase
DISABLE_FIREBASE="false"

# Firebase Configuration
FIREBASE_PROJECT_ID="your-actual-project-id"
FIREBASE_PRIVATE_KEY_ID="your-actual-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-actual-client-id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
```

**Important Notes:**
- Replace `\n` with actual newlines in the private key
- Keep the private key secure and never commit it to version control
- Use environment variables or secret management in production

### 4. Test Firebase Integration

Once configured, restart the backend server:
```bash
npm run dev
```

You should see:
```
🔥 Firebase initialized successfully
```

## Mobile App Configuration

The mobile app also needs Firebase configuration:

### 1. Add Firebase to Mobile App
1. In Firebase Console, add an app (iOS/Android)
2. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
3. Follow Expo Firebase setup guide

### 2. Update Mobile App Config
Add to `mobile/app.json`:
```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ]
  }
}
```

## Authentication Flow

### With Firebase Enabled:
1. User signs in via Firebase on mobile app
2. Mobile app receives Firebase ID token
3. Mobile app sends ID token to backend API
4. Backend validates token with Firebase Admin SDK
5. Backend returns JWT access token for API calls

### With Firebase Disabled (Current):
1. User signs in with email/password directly to backend
2. Backend validates credentials against database
3. Backend returns JWT access token for API calls

## Security Considerations

### Production Checklist:
- [ ] Enable Firebase authentication
- [ ] Configure proper CORS settings
- [ ] Use HTTPS for all communications
- [ ] Rotate Firebase service account keys regularly
- [ ] Enable Firebase security rules
- [ ] Monitor authentication logs
- [ ] Set up proper error handling

### Environment-Specific Settings:
- **Development**: Firebase disabled, mock authentication
- **Staging**: Firebase enabled with test project
- **Production**: Firebase enabled with production project

## Troubleshooting

### Common Issues:

1. **"Invalid PEM formatted message"**
   - Check private key format in .env file
   - Ensure newlines are properly escaped
   - Verify the private key is complete

2. **"Firebase not configured"**
   - Set `DISABLE_FIREBASE="false"`
   - Verify all Firebase environment variables are set
   - Check Firebase project permissions

3. **"Authentication failed"**
   - Verify service account has proper permissions
   - Check project ID matches Firebase console
   - Ensure client email is correct

### Debug Commands:
```bash
# Check Firebase initialization
curl http://localhost:3001/health

# Test authentication endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@business.com","password":"demo123"}'
```

## Migration Path

To migrate from local auth to Firebase:

1. **Phase 1**: Keep both authentication methods
2. **Phase 2**: Migrate existing users to Firebase
3. **Phase 3**: Remove local authentication
4. **Phase 4**: Full Firebase integration

This allows for gradual migration without breaking existing functionality.
