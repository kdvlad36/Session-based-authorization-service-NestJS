import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/services/auth.service';

jest.mock('../src/auth/services/auth.service');

// Настройка моков для методов AuthService
(AuthService.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
  uid: 'test-uid',
});

(AuthService.prototype.createSession as jest.Mock).mockResolvedValue({
  sessionId: 'test-sessionId',
});

describe('AuthController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    // Теперь idToken не имеет значения, так как функция замокана
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        idToken: 'mocked-idToken',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ sessionId: 'test-sessionId' }); // Проверяем, что ответ содержит ожидаемый sessionId
  });

  afterAll(async () => {
    await app.close();
  });
});
