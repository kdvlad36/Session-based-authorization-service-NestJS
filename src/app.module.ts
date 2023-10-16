import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';
import { SessionsModule } from './sessions/modules/sessions.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SessionsModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
