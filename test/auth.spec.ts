import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthModule } from '../src/auth/modules/auth.module';
// import { SessionService } from '../src/sessions/services/session.service';

jest.mock('../src/sessions/services/session.service', () => ({
  prototype: {
    createSession: jest.fn().mockResolvedValue({
      sessionId: 'test-sessionId',
      uid: 'test-uid',
      startedAt: new Date(),
    }),
  },
}));

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Auth Controller', () => {
    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201) // Expected status code
        .expect((res) => {
          // Additional assertions
          expect(res.body).toHaveProperty('sessionId');
        });
    });

    // ... other tests for AuthController
  });

  afterAll(async () => {
    await app.close();
  });
});
