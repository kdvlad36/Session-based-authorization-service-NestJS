import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from '../../auth/services/auth.service';
import { RequestWithSession } from '../models/types.d';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithSession, res: Response, next: NextFunction) {
    console.log('Middleware invoked');
    try {
      const idToken = req.headers.authorization?.split(' ')[1];
      console.log('ID Token:', idToken);

      if (!idToken) {
        throw new Error('ID token is missing');
      }

      const decodedIdToken = await this.authService.verifyIdToken(idToken);
      console.log('Decoded ID Token:', decodedIdToken);

      if (!decodedIdToken) {
        throw new Error('Invalid ID token');
      }

      const uid = decodedIdToken.uid;
      console.log('User ID:', uid);

      if (!uid) {
        throw new Error('User ID is missing');
      }

      const session = await this.authService.createSession(uid, req);
      console.log('Session:', session);

      req.session = session; // Присвоение сессии в объект запроса
      console.log('Session in Middleware:', req.session);

      next();
    } catch (error) {
      console.error('Session middleware error:', error);
      res.status(401).send('Unauthorized');
    }
  }
}
