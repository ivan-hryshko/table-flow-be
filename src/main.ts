if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request as ExpressRequest, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3001);
  console.log(`Application running at ${await app.getUrl()}`)
}
bootstrap();
