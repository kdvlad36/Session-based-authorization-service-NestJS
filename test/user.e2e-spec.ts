import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersModule } from '../src/users/modules/user.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    // Add additional assertions
  });

  it('/users/search (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/search')
      .query({ email: 'test@example.com' })
      .expect(200);

    expect(response.body).toHaveProperty('email', 'test@example.com');
    // Add additional assertions
  });

  afterAll(async () => {
    await app.close();
  });
});
