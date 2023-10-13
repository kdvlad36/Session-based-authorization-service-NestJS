import * as admin from 'firebase-admin';
type Timestamp = admin.firestore.Timestamp;

export type Session = {
  sessionId: string; // Уникальный идентификатор сессии
  device: string; // Информация об устройстве, с которого был выполнен вход
  createdAt: Timestamp; // Время начала сессии
};
