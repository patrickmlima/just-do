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
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  bootstrapSwagger(app);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('application');
  await app.listen(appConfig.appPort);
}
bootstrap();
