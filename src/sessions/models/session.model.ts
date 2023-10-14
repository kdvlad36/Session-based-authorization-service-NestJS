export class Session {
  sessionId: string; // Уникальный идентификатор сессии
  userId: string; // Идентификатор пользователя, связанный с этой сессией
  startedAt: Date; // Дата и время начала сессии
  endedAt?: Date; // Дата и время окончания сессии
  sessionData?: any; // Данные сессии

  constructor(
    sessionId: string,
    userId: string,
    startedAt: Date,
    endedAt?: Date,
    sessionData?: any,
  ) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.sessionData = sessionData;
  }
}
