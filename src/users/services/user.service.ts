import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { db } from '../../main';

@Injectable()
export class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = [];
      const snapshot = await db.collection('users').get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push(
          new User(
            data.uid,
            data.email,
            data.sessions,
            data.createdAt.toDate(),
            data.updatedAt.toDate(),
          ),
        );
      });

      return users;
    } catch (error) {
      throw new Error('Error fetching users: ' + error);
    }
  }
}
