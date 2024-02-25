import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default class TypeOrmConfig {
  static getConfig(configService: ConfigService): PostgresConnectionOptions {
    console.log('hello');
    if (configService.get('IS_PROD')) {
      return {
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // This for development
        ssl: {
          rejectUnauthorized: false,
        },
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      };
    } else {
      return {
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // This for development
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      };
    }
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<PostgresConnectionOptions> =>
    TypeOrmConfig.getConfig(configService),
  inject: [ConfigService],
};
