import { RegisterDto } from '../dto/register.dto';
import { db } from '../../../firebase';
import * as admin from 'firebase-admin';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../users/models/user.model';
import { Session } from '../../sessions/models/session.model';
import { SessionService } from '../../sessions/services/session.service';
import { Request } from 'express';
import { LoginDto } from '../dto/login.dto';
import { url } from 'token/url';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly sessionService: SessionService) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { email, password } = registerDto;

      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      if (!userRecord.email) {
        throw Error('User created, but email is not set');
      }

      const createdAt = new Date();
      const updatedAt = new Date();
      const sessions: Session[] = [];

      const userRef = db.collection('users').doc(userRecord.uid);
      await userRef.set({
        email: userRecord.email,
        uid: userRecord.uid,
        createdAt,
        updatedAt,
        sessions,
      });

      return new User(
        userRecord.uid,
        userRecord.email,
        sessions,
        createdAt,
        updatedAt,
      );
    } catch (error) {
      throw Error('Error creating new user: ' + error);
    }
  }
  async login(loginDto: LoginDto, req: Request): Promise<Session> {
    try {
      const { email, password } = loginDto;

      const idToken = await this.getIdToken(email, password);

      const decodedIdToken = await this.verifyIdToken(idToken);
      const uid = decodedIdToken.uid;

      // create session
      const session = await this.sessionService.createSession(uid, req);
      console.log(uid);

      return session;
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      console.log('ID Token:', idToken);
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      return decodedIdToken;
    } catch (error) {
      throw Error('Error verifying ID token: ' + error);
    }
  }

  async getIdToken(email: string, password: string): Promise<string> {
    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      if (response.data && response.data.idToken) {
        return response.data.idToken;
      } else {
        throw new Error('ID token is missing in the response');
      }
    } catch (error) {
      console.error('Error getting ID token:', error);
      throw new HttpException(
        'Failed to get ID token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
