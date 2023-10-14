import { Injectable } from '@nestjs/common';
import { Session } from '../models/session.model';
import { db } from '../../main';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/services/auth.service';
import { Request } from 'express';

@Injectable()
export class SessionService {
  constructor(private readonly authService: AuthService) {}

  async startSession(
    userId: string,
    req: Request,
    sessionData?: any,
  ): Promise<Session> {
    const sessionId = uuidv4();
    const startedAt = new Date();
    const deviceInfo = this.authService.getDeviceInfo(req); // Добавлено получение информации об устройстве

    const session = new Session(
      sessionId,
      userId,
      startedAt,
      undefined, // endedAt will be undefined when the session is first created
      sessionData,
      deviceInfo, // Added device info to the session
      startedAt, // ceatedAt
    );

    await db.collection('sessions').doc(sessionId).set(session); // Updated to set the entire session object

    return session;
  }
}
