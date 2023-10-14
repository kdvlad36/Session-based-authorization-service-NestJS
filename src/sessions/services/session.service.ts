import { Injectable } from '@nestjs/common';
import { Session } from '../models/session.model';
import { db } from '../../main';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/services/auth.service';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class SessionService {
  constructor(private readonly authService: AuthService) {}

  async updateSessionActivity(sessionId: string): Promise<void> {
    const sessionRef = db.collection('sessions').doc(sessionId);
    await sessionRef.update({
      lastActive: admin.firestore.Timestamp.now(), // Используйте это вместо db.Timestamp.now()
    });
  }

  async getActiveSessions(uid: string): Promise<Session[]> {
    try {
      console.log('getActiveSessions called with UID:', uid);

      const inactivityPeriod = 30 * 60 * 1000; // 30 minutes in milliseconds
      const now = admin.firestore.Timestamp.now();

      const sessionsRef = admin.firestore().collection('sessions');
      const snapshot = await sessionsRef.where('uid', '==', uid).get();

      const sessions = snapshot.docs
        .map((doc) => doc.data() as Session)
        .filter((session) => {
          const lastActive = session.lastActive.toMillis();
          return now.toMillis() - lastActive < inactivityPeriod;
        });

      return sessions;
    } catch (error) {
      console.error('Error in getActiveSessions:', error);
      throw error;
    }
  }

  async startSession(
    uid: string,
    req: Request,
    sessionData?: any,
  ): Promise<Session> {
    const sessionId = uuidv4();
    const deviceInfo = this.authService.getDeviceInfo(req); // Добавлено получение информации об устройстве

    const session = new Session(
      sessionId,
      uid,
      admin.firestore.Timestamp.fromDate(new Date()), // Изменено на Timestamp
      undefined, // endedAt will be undefined when the session is first created
      sessionData,
      deviceInfo, // Added device info to the session
      admin.firestore.Timestamp.fromDate(new Date()), // Изменено на Timestamp
      // ceatedAt
    );

    await db.collection('sessions').doc(sessionId).set(session); // Updated to set the entire session object

    return session;
  }
}
