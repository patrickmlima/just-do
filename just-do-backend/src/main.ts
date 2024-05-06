import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

const bootstrapSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Just Do API')
    .setDescription('The straight and simple To Do app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  bootstrapSwagger(app);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('application');
  await app.listen(appConfig.appPort);
}
bootstrap();
