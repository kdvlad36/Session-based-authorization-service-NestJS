import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/users/controllers/user.controller';
import { UserService } from '../src/users//services/user.service';
import { db } from '../firebase';
import { User } from '../src/users//models/user.model';

import mockFirebaseAdmin from './firebase-admin.mock';

jest.mock('firebase-admin', () => mockFirebaseAdmin);

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [
        new User('1', 'test1@example.com', [], new Date(), new Date()),
        new User('2', 'test2@example.com', [], new Date(), new Date()),
      ];

      jest.spyOn(db.collection('users'), 'get').mockResolvedValueOnce({
        forEach(callback) {
          result.forEach((user) =>
            callback({
              data: () => ({
                uid: user.uid,
                email: user.email,
                sessions: user.sessions,
                createdAt: { toDate: () => user.createdAt },
                updatedAt: { toDate: () => user.updatedAt },
              }),
            }),
          );
        },
      } as any);

      expect(await userController.getAllUsers()).toBe(result);
    });
  });
});
