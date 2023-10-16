import * as admin from 'firebase-admin';
import { Request } from 'express';

export class Session {
  sessionId: string;
  uid: string;
  startedAt: admin.firestore.Timestamp;
  endedAt?: admin.firestore.Timestamp;
  sessionData?: any;
  device: string;
  createdAt: admin.firestore.Timestamp;
  lastActive: admin.firestore.Timestamp;

  constructor(
    sessionId: string,
    uid: string,
    startedAt: admin.firestore.Timestamp,
    endedAt?: admin.firestore.Timestamp,
    sessionData?: any,
    device?: string,
    createdAt?: admin.firestore.Timestamp,
    lastActive?: admin.firestore.Timestamp,
  ) {
    this.sessionId = sessionId;
    this.uid = uid;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.sessionData = sessionData;
    this.device = device || '';
    this.createdAt = createdAt || admin.firestore.Timestamp.now();
    this.lastActive = lastActive || admin.firestore.Timestamp.now();
  }
}

export interface RequestWithSession extends Request {
  session?: Session;
}
