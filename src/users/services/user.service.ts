import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { db } from '../../../firebase';

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
  async getUserByCriteria(criteria: {
    uid?: string;
    email?: string;
    name?: string;
    createdAt?: Date;
  }): Promise<User | null> {
    try {
      let query = db.collection('users').limit(1);

      if (criteria.uid) {
        query = query.where('uid', '==', criteria.uid);
      } else if (criteria.email) {
        query = query.where('email', '==', criteria.email);
      } else if (criteria.createdAt) {
        query = query.where('createdAt', '==', criteria.createdAt);
      } else {
        throw new Error('Invalid criteria provided');
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return new User(
        data.uid,
        data.email,
        data.sessions,
        data.createdAt.toDate(),
        data.updatedAt.toDate(),
      );
    } catch (error) {
      throw new Error('Error fetching user by criteria: ' + error);
    }
  }
}
