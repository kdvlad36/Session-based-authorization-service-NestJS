import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Session } from '../models/session.model';
import { User } from '../../users/models/user.model';
import { db } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import * as useragent from 'express-useragent';

@Injectable()
export class SessionService {
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
        throw Error('User data is undefined');
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

      const startedAt = admin.firestore.Timestamp.fromDate(new Date());

      const session = new Session(
        sessionId,
        uid,
        startedAt,
        true, // isActive
        undefined, // endedAt
        undefined, // sessionData
        deviceInfo,
      );

      await this.saveSessionToDB(session);

      return session;
    } catch (error) {
      console.log('Error creating session:', error);
      throw error;
    }
  }
  async getActiveSessions(uid: string): Promise<Session[]> {
    try {
      console.log('getActiveSessions called with UID:', uid);

      const userRef = db.collection('users').doc(uid); // Getting the user document by UID
      const doc = await userRef.get();

      if (!doc.exists) {
        console.log('User does not exist');
        return [];
      }

      const user = doc.data() as User; // Getting the user data
      const sessions = user.sessions || []; // Extracting the sessions

      const activeSessions = sessions.filter((session) => session.isActive); // Filtering the active sessions

      return activeSessions;
    } catch (error) {
      console.error('Error in getActiveSessions:', error);
      throw error;
    }
  }

  async getAllSessions(uid: string): Promise<Session[]> {
    try {
      console.log('getAllSessions called with UID:', uid);

      const userRef = db.collection('users').doc(uid); // Getting the user document by UID
      const doc = await userRef.get();

      if (!doc.exists) {
        console.log('User does not exist');
        return [];
      }

      const user = doc.data() as User; // Getting the user data
      const allSessions = user.sessions || []; // Extracting all the sessions

      return allSessions;
    } catch (error) {
      console.error('Error in getAllSessions:', error);
      throw error;
    }
  }
  async startSession(
    uid: string,
    req: Request,
    sessionData?: any,
  ): Promise<Session> {
    const sessionId = uuidv4();
    const deviceInfo = this.getDeviceInfo(req);

    const session = new Session(
      sessionId,
      uid,
      admin.firestore.Timestamp.now(),
      true, // isActive
      undefined, // endedAt
      sessionData,
      deviceInfo,
    );

    // Get a link to the user's document and add a new session to the user's sessions array
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      sessions: admin.firestore.FieldValue.arrayUnion(session),
    });

    return session;
  }

  async endSession(uid: string, sessionId: string): Promise<void> {
    try {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.error('User not found:', uid);
        throw new Error('User not found');
      }

      const user = userDoc.data();
      const session = user.sessions.find((s) => s.sessionId === sessionId);

      if (!session) {
        console.error('Session not found:', sessionId);
        throw new Error('Session not found');
      }

      session.endedAt = admin.firestore.Timestamp.now();
      session.isActive = false; // Mark the session as inactive

      await userRef.update(user); // Update the user document

      console.log('Session ended:', sessionId);
    } catch (error) {
      console.error('Error in endSession:', error);
      throw error;
    }
  }

  async checkAndEndInactiveSessions(): Promise<void> {
    try {
      const usersRef = db.collection('users');
      const now = Date.now();
      const inactivityPeriod = 60 * 60 * 1000; // 60 minutes in milliseconds

      const snapshot = await usersRef.get();
      snapshot.docs.forEach(async (doc) => {
        const user = doc.data();
        user.sessions.forEach((session) => {
          if (now - session.lastActive.toMillis() > inactivityPeriod) {
            session.isActive = false;
            session.endedAt = admin.firestore.Timestamp.now();
            console.log('Session ended:', session.sessionId);
          }
        });
        await doc.ref.update(user);
      });

      console.log('Checked and ended inactive sessions if any');
    } catch (error) {
      console.error('Error in checkAndEndInactiveSessions:', error);
      throw error;
    }
  }

  async endAllSessions(uid: string): Promise<void> {
    try {
      console.log('Ending all sessions for UID:', uid);

      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log('User not found:', uid);
        return;
      }

      const user = userDoc.data();
      user.sessions.forEach((session) => {
        session.isActive = false;
        session.endedAt = admin.firestore.Timestamp.now();
        console.log('Ending session:', session.sessionId);
      });

      await userRef.update(user);

      console.log('All sessions ended for UID:', uid);
    } catch (error) {
      console.error('Error in endAllSessions:', error);
      throw error;
    }
  }

  async deleteAllSessions(uid: string): Promise<void> {
    try {
      console.log('deleteAllSessions called with UID:', uid);

      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log('User not found:', uid);
        return;
      }

      const user = userDoc.data();
      user.sessions = []; // Just clear the sessions array

      await userRef.update(user);

      console.log('All sessions deleted for UID:', uid);
    } catch (error) {
      console.error('Error in deleteAllSessions:', error);
      throw error;
    }
  }
}
