import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as admin from 'firebase-admin';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    // Skip Firebase initialization if explicitly disabled
    if (process.env.DISABLE_FIREBASE === 'true') {
      console.log('🔥 Firebase disabled via DISABLE_FIREBASE=true - running in local development mode');
      return;
    }

    // Skip Firebase initialization if credentials are not properly configured
    const hasValidCredentials =
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project' &&
      process.env.FIREBASE_PRIVATE_KEY !== '-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----';

    if (!hasValidCredentials) {
      console.log('🔥 Firebase credentials not configured - running in local development mode');
      return;
    }

    if (!admin.apps.length) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
      };

      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
        console.log('🔥 Firebase initialized successfully');
      } catch (error) {
        console.error('🔥 Firebase initialization failed:', error.message);
        console.log('🔥 Running without Firebase authentication');
      }
    }
  }

  async validateFirebaseToken(idToken: string) {
    try {
      // Check if Firebase is initialized
      if (!admin.apps.length) {
        throw new UnauthorizedException('Firebase not configured - use local authentication');
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async loginWithFirebase(idToken: string) {
    const firebaseUser = await this.validateFirebaseToken(idToken);
    
    let user = await this.usersService.findByFirebaseUid(firebaseUser.uid);
    
    if (!user) {
      // Create new user
      user = await this.usersService.create({
        email: firebaseUser.email,
        displayName: firebaseUser.name || firebaseUser.email?.split('@')[0],
        firebaseUid: firebaseUser.uid,
        isVerified: firebaseUser.email_verified || false,
      });
    } else {
      // Update last seen
      await this.usersService.updateLastSeen(user.id);
    }

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async generateTokens(user: any): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
