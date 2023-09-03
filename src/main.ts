if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
