import { Session } from '../../sessions/types/session.type';

export class User {
  uid: string; // Уникальный идентификатор пользователя
  email: string; // Электронная почта пользователя
  password: string; // Хэшированный пароль пользователя
  sessions: Session[]; // Массив активных сессий пользователя

  constructor(
    uid: string,
    email: string,
    password: string,
    sessions: Session[],
  ) {
    this.uid = uid;
    this.email = email;
    this.password = password;
    this.sessions = sessions;
  }
}
