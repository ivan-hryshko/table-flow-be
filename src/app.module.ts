import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/user/user.module';
import { AuthMiddleWare } from './user/middlewares/auth.middleware';
import { typeOrmConfigAsync } from '@app/ormconfig';
import { RestaurantModule } from './restaurant/restaurant.modules';
import { TableModule } from './table/table.module';
import { FloorModule } from './floor/floor.modules';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UserModule,
    RestaurantModule,
    TableModule,
    FloorModule,
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
