import * as admin from 'firebase-admin';
import { Request } from 'express';

export interface DeviceInfo {
  device: string;
  browser: string;
  platform: string;
  source: string;
  lastLoggedIn: admin.firestore.Timestamp;
}

export class Session {
  constructor(
    public sessionId: string,
    public uid: string,
    public startedAt: admin.firestore.Timestamp,
    public isActive: boolean,
    public endedAt?: admin.firestore.Timestamp,
    public sessionData?: any,
    public deviceInfo?: DeviceInfo,
  ) {
    if (!this.isActive) {
      this.endedAt = admin.firestore.Timestamp.now();
    }
  }
}

export interface RequestWithSession extends Request {
  session?: Session;
}
