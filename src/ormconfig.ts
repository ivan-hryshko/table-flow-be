import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default class TypeOrmConfig {
  static getConfig(configService: ConfigService): PostgresConnectionOptions {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      url: configService.get('DB_URI'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // This for development
      // autoLoadEntities: true,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations'
      },
    }
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService):Promise<PostgresConnectionOptions> => TypeOrmConfig.getConfig(configService),
  inject: [ConfigService]
}