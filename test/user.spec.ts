import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/users/services/user.service';
import * as admin from 'firebase-admin';
import { mock, instance } from 'ts-mockito';
// Объявите firestoreMock перед его использованием

jest.mock('firebase-admin', () => {
  const admin = jest.requireActual('firebase-admin');
  return {
    ...admin,
    firestore: jest.fn(() => ({
      // ваш мок firestore
    })),
    initializeApp: jest.fn(),
  };
});

describe('UserService', () => {
  let service: UserService;
  let firestore: admin.firestore.Firestore;

  beforeEach(async () => {
    firestore = mock(admin.firestore.Firestore);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'Firestore',
          useValue: instance(firestore),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add other unit tests to test other methods in the service
});
