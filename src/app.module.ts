import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthMiddleWare } from './user/middlewares/auth.middleware';
import { typeOrmConfigAsync } from './ormconfig';
import { RestaurantModule } from './restaurant/restaurant.modules';
import { TableModule } from './table/table.module';
import { FloorModule } from './floor/floor.modules';
import { MyConfigModule } from "./config.module";


@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UserModule,
    RestaurantModule,
    TableModule,
    FloorModule,
    MyConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
