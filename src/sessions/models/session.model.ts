import * as admin from 'firebase-admin';

export class Session {
  sessionId: string;
  uid: string;
  startedAt: admin.firestore.Timestamp; // Предполагая, что вы хотите использовать Timestamp здесь также
  endedAt?: admin.firestore.Timestamp;
  sessionData?: any;
  device: string;
  createdAt: admin.firestore.Timestamp;
  lastActive: admin.firestore.Timestamp; // Новое свойство

  constructor(
    sessionId: string,
    uid: string,
    startedAt: admin.firestore.Timestamp,
    endedAt?: admin.firestore.Timestamp,
    sessionData?: any,
    device?: string,
    createdAt?: admin.firestore.Timestamp,
    lastActive?: admin.firestore.Timestamp, // Новый параметр
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
