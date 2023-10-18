import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';
import { SessionsModule } from './sessions/modules/session.module';

@Module({
  imports: [UsersModule, AuthModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
