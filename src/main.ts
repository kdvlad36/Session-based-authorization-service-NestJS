import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API документация')
    .setDescription('Описание API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Получаем экземпляр AppModule
  const appModule = app.get<AppModule>(AppModule);

  // Убедитесь, что appModule имеет свойство app и присвойте ему экземпляр app
  if (appModule && 'app' in appModule) {
    appModule.app = app;
  }

  await app.listen(3000);
}
bootstrap();
