import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantEntity } from "./restaurant.entity";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { AuthGuard } from "@app/user/guards/auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  controllers:[RestaurantController],
  providers: [RestaurantService, AuthGuard],
})
export class RestaurantModule {}
