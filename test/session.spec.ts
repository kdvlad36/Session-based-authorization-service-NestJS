import mockFirebaseAdmin from './firebase-admin.mock';

jest.mock('firebase-admin', () => mockFirebaseAdmin);

import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from '../src/sessions/controllers/session.controller';
import { SessionService } from '../src/sessions/services/session.service';
import { AuthService } from '../src/auth/services/auth.service';
// import { db } from '../firebase';
import * as admin from 'firebase-admin';
import { SessionMiddleware } from '../src/sessions/middlewares/session.middleware';
import { RequestWithSession } from '../src/sessions/models/session.model';
import { Response, NextFunction } from 'express';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;
  console.log('start test SessionController');

  beforeEach(async () => {
    service = { getActiveSessions: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should return active sessions', async () => {
    (service.getActiveSessions as jest.Mock).mockResolvedValue([
      { sessionId: '1', uid: 'user1' },
    ]);

    const result = await controller.getActiveSessions({
      session: { uid: 'user1' },
    } as any);

    expect(result).toEqual([{ sessionId: '1', uid: 'user1' }]);
  });

  it('should return no active sessions message if no active sessions are found', async () => {
    (service.getActiveSessions as jest.Mock).mockResolvedValue([]);

    const result = await controller.getActiveSessions({
      session: { uid: 'user1' },
    } as any);

    expect(result).toEqual({ message: 'No active sessions' });
  });

  // More test cases can be added as needed
});

describe('SessionService', () => {
  let service: SessionService;
  let authService: Partial<AuthService>;

  const mockedTimestamp: admin.firestore.Timestamp = {
    seconds: 1234567890,
    nanoseconds: 123456789,
    toDate: () => new Date(),
    toMillis: () => new Date().getTime(),
    isEqual: (other) =>
      other.seconds === 1234567890 && other.nanoseconds === 123456789,
    valueOf: () => 'mocked-timestamp',
  } as any;

  beforeAll(() => {
    jest.mock('firebase-admin', () => ({
      ...jest.requireActual('firebase-admin'),
      firestore: () => ({
        Timestamp: {
          now: jest.fn(() => mockedTimestamp),
          fromDate: jest.fn(() => mockedTimestamp),
          fromMillis: jest.fn(() => mockedTimestamp),
          prototype: {
            constructor: jest.fn(() => mockedTimestamp),
          },
        },
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        set: jest.fn().mockResolvedValueOnce(true),
      }),
    }));
  });

  beforeEach(async () => {
    authService = {
      getDeviceInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start a session', async () => {
    const sessionData = { someData: 'data' };
    const request = { headers: { 'user-agent': 'test' } } as any;

    const session = await service.startSession('user1', request, sessionData);
    expect(session.uid).toBe('user1');
    expect(admin.firestore().collection).toHaveBeenCalledWith('sessions');
  });

  // Другие тесты...
});

describe('SessionMiddleware', () => {
  let middleware: SessionMiddleware;
  let authService: Partial<AuthService>;
  console.log('start test SessionMiddleware');

  beforeEach(async () => {
    authService = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'user1' }),
      createSession: jest
        .fn()
        .mockResolvedValue({ sessionId: '1', uid: 'user1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionMiddleware,
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    middleware = module.get<SessionMiddleware>(SessionMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should pass with valid token', async () => {
    const req: Partial<RequestWithSession> = {
      headers: { authorization: 'Bearer token' },
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    await middleware.use(req as RequestWithSession, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.session).toBeDefined();
  });

  it('should fail with no token', async () => {
    const req: Partial<RequestWithSession> = { headers: {} };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    await middleware.use(req as RequestWithSession, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  // You can add more tests for other error conditions, like invalid token, no uid, etc.
});
