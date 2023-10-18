import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from '../src/sessions/services/session.service';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import { SessionsModule } from '../src/sessions/modules/session.module';
import { db } from '../firebase';

describe('SessionService', () => {
  let service: SessionService;
  let mockReq: Partial<Request>;
  const testUid = 'testUid';

  beforeEach(async () => {
    // Initialize Firebase Admin SDK for testing
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://<your-database-name>.firebaseio.com',
      });
    }

    mockReq = {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [SessionsModule],
    }).compile();

    service = module.get<SessionService>(SessionService);

    // Create a test user in the database
    const userRef = db.collection('users').doc(testUid);
    await userRef.set({
      uid: testUid,
      sessions: [],
      // ... other necessary user data ...
    });
  });

  afterEach(async () => {
    // Delete the test user from the database
    const userRef = db.collection('users').doc(testUid);
    await userRef.delete();
  });

  describe('createSession', () => {
    it('should create a new session and save it to the database', async () => {
      const session = await service.createSession(testUid, mockReq as Request);

      expect(session).toBeDefined();
      expect(session.uid).toBe(testUid);

      // Verify the session has been saved in the database
      const userRef = db.collection('users').doc(testUid);
      const userSnapshot = await userRef.get();
      expect(userSnapshot.exists).toBeTruthy();

      const userData = userSnapshot.data();
      expect(userData.sessions).toContainEqual(
        expect.objectContaining({ sessionId: session.sessionId }),
      );
    });
  });

  // ... rest of your tests ...
});
