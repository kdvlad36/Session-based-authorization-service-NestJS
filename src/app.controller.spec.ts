import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/modules/auth.module';
import { UsersModule } from './users/modules/user.module';
import { SessionController } from './sessions/controllers/session.controller';
import { SessionService } from './sessions/services/session.service';
import { AuthService } from './auth/services/auth.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
      controllers: [AppController, SessionController],
      providers: [AppService, SessionService, AuthService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
