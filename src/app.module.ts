import {
  Module,
  NestModule,
  MiddlewareConsumer,
  forwardRef,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/modules/user.module';
import { AuthModule } from './auth/modules/auth.module';
import { SessionsModule } from './sessions/modules/sessions.module';
import { INestApplication } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SessionsModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public app: INestApplication;
  constructor(app: INestApplication) {
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_consumer: MiddlewareConsumer) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document);
  }
}
