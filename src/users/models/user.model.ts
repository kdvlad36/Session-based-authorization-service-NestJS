import { Session } from '../../sessions/types/session.type';

export class User {
  uid: string;
  email: string;
  sessions: Session[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    uid: string,
    email: string,
    sessions: Session[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.uid = uid;
    this.email = email;
    this.sessions = sessions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
