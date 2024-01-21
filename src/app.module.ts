import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MyConfigModule } from './config.module';
import { AuthMiddleWare } from './modules/auth/middlewares/auth.middleware';
import { FloorModule } from './modules/floor/floor.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { TableModule } from './modules/table/table.module';
import { UserModule } from './modules/user/user.module';
import { typeOrmConfigAsync } from './ormconfig';
import { ReserveModule } from './modules/reserve/reserve.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UserModule,
    RestaurantModule,
    TableModule,
    FloorModule,
    MyConfigModule,
    ReserveModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
