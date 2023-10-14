import { RegisterDto } from '../dto/register.dto';
import { db } from '../../main';
import * as admin from 'firebase-admin';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../users/models/user.model';
import { Session } from '../../sessions/models/session.model';
import * as useragent from 'express-useragent';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { email, password } = registerDto;

      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      if (!userRecord.email) {
        throw new Error('User created, but email is not set');
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
      throw new Error('Error creating new user: ' + error);
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      console.log('ID Token:', idToken);
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      return decodedIdToken;
    } catch (error) {
      throw new Error('Error verifying ID token: ' + error);
    }
  }

  public getDeviceInfo(req: Request): any {
    const source = req.headers['user-agent'] as string;
    const agent = useragent.parse(source);

    return {
      device: agent.isDesktop ? 'Desktop' : agent.isMobile ? 'Mobile' : 'Other',
      browser: agent.browser,
      platform: agent.platform,
      source: agent.source,
      lastLoggedIn: new Date(),
    };
  }
  private async saveSessionToDB(session: Session): Promise<void> {
    try {
      const userRef = db.collection('users').doc(session.uid);
      const userSnapshot = await userRef.get();
      if (!userSnapshot.exists) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const userData = userSnapshot.data();
      if (!userData) {
        throw new Error('User data is undefined');
      }

      const plainSessionObject = JSON.parse(JSON.stringify(session));

      userData.sessions.push(plainSessionObject);
      await userRef.update({ sessions: userData.sessions }); // Update only the sessions property
    } catch (error) {
      throw new Error('Error saving session to DB: ' + error);
    }
  }

  async createSession(uid: string, req: Request): Promise<Session> {
    try {
      const sessionId = uuidv4();
      const deviceInfo = this.getDeviceInfo(req);

      const startedAt = admin.firestore.Timestamp.fromDate(new Date()); // This line is fixed

      const session = new Session(
        sessionId,
        uid,
        startedAt, // This should be a Firestore Timestamp
        deviceInfo,
      );

      await this.saveSessionToDB(session);

      return session;
    } catch (error) {
      throw new Error('Error creating session: ' + error);
    }
  }
}
