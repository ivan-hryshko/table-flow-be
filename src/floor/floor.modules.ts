import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantEntity } from "./floor.entity";
import { RestaurantController } from "./floor.controller";
import { RestaurantService } from "./floor.service";
import { AuthGuard } from "@app/user/guards/auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  controllers:[RestaurantController],
  providers: [RestaurantService, AuthGuard],
  exports: [RestaurantService],
})
export class RestaurantModule {}
