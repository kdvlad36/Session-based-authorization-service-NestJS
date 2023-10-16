import { Module, forwardRef } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { SessionController } from '../controllers/session.controller';
import { AuthModule } from '../../auth/modules/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionsModule {}
