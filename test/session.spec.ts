import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from '../src/sessions/services/session.service';
import { Request } from 'express';
import { db } from '../firebase';

jest.mock('../firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase-admin', () => ({
  firestore: {
    Timestamp: {
      fromDate: jest.fn(),
    },
  },
}));

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a session', async () => {
      const mockReq: Partial<Request> = {
        headers: {
          'user-agent': 'Mozilla/5.0',
        },
      };

      const mockUserRef = {
        get: jest.fn().mockResolvedValueOnce({
          exists: true,
          data: jest.fn().mockReturnValueOnce({
            sessions: [],
          }),
        }),
        update: jest.fn().mockResolvedValueOnce(null),
      };

      (db.collection as jest.Mock).mockReturnValueOnce({
        doc: jest.fn().mockReturnValueOnce(mockUserRef),
      });

      const session = await service.createSession('uid', mockReq as Request);

      expect(session).toBeDefined();
      expect(db.collection).toHaveBeenCalledWith('users');
      expect(mockUserRef.update).toHaveBeenCalled();
    });
  });
});
