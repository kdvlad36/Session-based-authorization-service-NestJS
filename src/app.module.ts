import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';
import { SessionsModule } from './sessions/modules/sessions.module';
import { SessionMiddleware } from './sessions/middlewares/session.middleware';

@Module({
  imports: [UsersModule, AuthModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
