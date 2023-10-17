import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API документация')
    .setDescription('Описание API')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument, 'utf8');

  SwaggerModule.setup('api', app, document);

  const port = 3000;

  console.log('API: http://localhost:3000/api');

  await app.listen(port, () => {
    console.log(`Application is running on http://localhost:${port}`);
  });
}
bootstrap();
