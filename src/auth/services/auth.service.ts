import { RegisterDto } from '../dto/register.dto';
import { db } from '../../main';

import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

import { User } from '../../users/models/user.model';
import { Session } from '../../sessions/types/session.type';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { email, password } = registerDto;

      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      if (!userRecord.email) {
        throw new Error('User created, but email is not set');
      }

      const createdAt = new Date();
      const updatedAt = new Date();
      const sessions: Session[] = [];

      const userRef = db.collection('users').doc(userRecord.uid);
      await userRef.set({
        email: userRecord.email,
        uid: userRecord.uid,
        createdAt,
        updatedAt,
        sessions,
      });

      return new User(
        userRecord.uid,
        userRecord.email,
        sessions,
        createdAt,
        updatedAt,
      );
    } catch (error) {
      throw new Error('Error creating new user: ' + error);
    }
  }
}
