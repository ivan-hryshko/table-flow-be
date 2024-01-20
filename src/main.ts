import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppConfig } from './config/config.types';
import { SwaggerHelper } from './utils/helpers/swagger.helper';

function initSwagger(app: INestApplication): void {
  const documentBuilder: DocumentBuilder = new DocumentBuilder()
    .setTitle('TableFlow API')
    .setDescription('TableFlow API Documentation')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .setVersion('1');

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerHelper.setDefaultResponses(document);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelExpandDepth: 1,
      persistAuthorization: true,
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const appConfig: AppConfig = configService.get('app');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();
  initSwagger(app);

  await app.listen(appConfig.port, appConfig.host, async () => {
    const url = `http://${appConfig.host}:${appConfig.port}`;

    Logger.log(`Application running at ${url}`);
    Logger.log(`Swagger running at ${url}/docs`);
  });
}
void bootstrap();
