import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any) {
    const idToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!idToken) {
      throw new UnauthorizedException('No Firebase token provided');
    }

    try {
      const firebaseUser = await this.authService.validateFirebaseToken(idToken);
      return firebaseUser;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
