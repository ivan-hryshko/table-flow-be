// Створив 19.11
// Видалити, якщо не спрацює

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // встановлюємо isGlobal, щоб конфігурація була доступна в усьому додатку
    }),
  ],
})
export class MyConfigModule {}
