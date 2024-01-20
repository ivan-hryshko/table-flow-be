import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { Config, PostgresConfig } from '../../config/config.types';

@Injectable()
export class PostgresService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<Config>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const postgresConfig = this.configService.get<PostgresConfig>('postgres');
    const folderPath = path.join(process.cwd(), 'dist');

    return {
      type: 'postgres',
      url: postgresConfig.url,
      entities: [path.join(folderPath, 'modules', '**', '*.entity{.ts,.js}')],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
}
