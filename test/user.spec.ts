import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/users/controllers/user.controller';
import { UserService } from '../src/users/services/user.service';
import { User } from '../src/users/models/user.model';

// Мок данных пользователя
const usersMock: User[] = [
  new User('1', 'test@example.com', [], new Date(), new Date()),
];

// Мок для Firestore
const firestoreMock = {
  collection: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    // eslint-disable-next-line @typescript-eslint/ban-types
    forEach: (callback: Function) => {
      usersMock.forEach((user) => callback({ data: () => user }));
    },
  }),
};

// Мок для firebase-admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => firestoreMock),
}));

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const spy = jest
        .spyOn(userService, 'getAllUsers')
        .mockResolvedValue(usersMock);
      const users = await userController.getAllUsers();
      expect(users).toEqual(usersMock);
      expect(spy).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const errorMessage = 'Error fetching users';
      jest
        .spyOn(userService, 'getAllUsers')
        .mockRejectedValue(new Error(errorMessage));
      try {
        await userController.getAllUsers();
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
