import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/auth/services/auth.service';

describe('SessionController (e2e)', () => {
  let app: INestApplication;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'testUid' }),
      createSession: jest
        .fn()
        .mockResolvedValue({ sessionId: 'testSessionId' }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/sessions (GET) should return active sessions', async () => {
    const response = await request(app.getHttpServer())
      .get('/sessions')
      .set('Authorization', 'Bearer mockedIdToken')
      .expect(200); // Или другой ожидаемый HTTP статус код

    expect(response.body).toBeDefined();
    expect(authService.verifyIdToken).toHaveBeenCalledWith('mockedIdToken');
    expect(authService.createSession).toHaveBeenCalledWith(
      'testUid',
      expect.anything(),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
