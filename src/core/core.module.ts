import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/config';
import { PostgresModule } from './postgres/postgres.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PostgresModule,
  ],
  exports: [PostgresModule],
})
export class CoreModule {}
