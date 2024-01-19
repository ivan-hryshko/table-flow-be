import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { AuthMiddleWare } from './modules/auth/middlewares/auth.middleware';
import { FloorModule } from './modules/floor/floor.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { TableModule } from './modules/table/table.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CoreModule, UserModule, RestaurantModule, TableModule, FloorModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
