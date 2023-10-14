import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';
import { SessionController } from './sessions/controllers/session.controller';
import { SessionService } from './sessions/services/session.service';
import { AuthService } from './auth/services/auth.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController, SessionController],
  providers: [AppService, SessionService, AuthService],
})
export class AppModule {}
