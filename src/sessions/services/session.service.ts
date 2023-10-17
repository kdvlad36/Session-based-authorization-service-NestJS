import { Injectable } from '@nestjs/common';
import { Session } from '../models/session.model';
import { db } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../auth/services/auth.service';
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
    const deviceInfo = this.authService.getDeviceInfo(req); // Getting device information

    const session = new Session(
      sessionId,
      uid,
      admin.firestore.Timestamp.fromDate(new Date()),
      undefined, // endedAt will be undefined when the session is first created
      sessionData,
      deviceInfo, // Device info to the session
      admin.firestore.Timestamp.fromDate(new Date()),
      // ceatedAt
    );

    await db.collection('sessions').doc(sessionId).set(session); // Updated to set the entire session object

    return session;
  }
  async endSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = db.collection('sessions').doc(sessionId);
      await sessionRef.update({
        endedAt: admin.firestore.Timestamp.now(),
      });
      console.log('Session ended:', sessionId);
    } catch (error) {
      console.error('Error in endSession:', error);
      throw error;
    }
  }

  async checkAndEndInactiveSessions(): Promise<void> {
    try {
      const inactivityPeriod = 60 * 60 * 1000; // 60 minutes in milliseconds
      const now = admin.firestore.Timestamp.now();

      const sessionsRef = admin.firestore().collection('sessions');
      const snapshot = await sessionsRef.get();

      const inactiveSessions = snapshot.docs
        .map((doc) => doc.data() as Session)
        .filter((session) => {
          const lastActive = session.lastActive.toMillis();
          return now.toMillis() - lastActive >= inactivityPeriod;
        });

      const batch = db.batch();
      inactiveSessions.forEach((session) => {
        const sessionRef = db.collection('sessions').doc(session.sessionId);
        batch.update(sessionRef, {
          endedAt: admin.firestore.Timestamp.now(),
        });
      });

      await batch.commit();
      console.log('Inactive sessions ended');
    } catch (error) {
      console.error('Error in checkAndEndInactiveSessions:', error);
      throw error;
    }
  }
}
