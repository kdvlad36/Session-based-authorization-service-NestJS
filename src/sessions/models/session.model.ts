export class Session {
  sessionId: string; // Уникальный идентификатор сессии
  userId: string; // Идентификатор пользователя, связанный с этой сессией
  startedAt: Date; // Дата и время начала сессии
  endedAt?: Date; // Дата и время окончания сессии
  sessionData?: any; // Данные сессии
  device: string; // Информация об устройстве, с которого был выполнен вход
  createdAt: Date; // Время начала сессии

  constructor(
    sessionId: string,
    userId: string,
    startedAt: Date,
    device: string, // Добавлено свойство device
    createdAt: Date, // Добавлено свойство createdAt
    endedAt?: Date,
    sessionData?: any,
  ) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.startedAt = startedAt;
    this.device = device; // Инициализировано свойство device
    this.createdAt = createdAt; // Инициализировано свойство createdAt
    this.endedAt = endedAt;
    this.sessionData = sessionData;
  }
}
