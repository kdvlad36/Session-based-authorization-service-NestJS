import { Injectable } from '@nestjs/common';
import { Session } from '../models/session.model';
import { db } from '../../main';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionService {
  async startSession(userId: string, sessionData?: any): Promise<Session> {
    const sessionId = uuidv4();
    const startedAt = new Date();

    const session = new Session(
      sessionId,
      userId,
      startedAt,
      undefined,
      sessionData,
    );

    await db
      .collection('sessions')
      .doc(sessionId)
      .set({
        ...session,
        userId,
        startedAt,
        sessionData,
      });

    return session;
  }

  // Add more methods as needed for ending sessions, fetching sessions, etc.
}
