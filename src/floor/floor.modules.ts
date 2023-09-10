import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FloorEntity } from "./floor.entity";
import { FloorController } from "./floor.controller";
import { FloorService } from "./floor.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { RestaurantModule } from "@app/restaurant/restaurant.modules";

@Module({
  imports: [
    TypeOrmModule.forFeature([FloorEntity]),
    RestaurantModule,
  ],
  controllers:[FloorController],
  providers: [FloorService, AuthGuard],
  exports: [FloorService],
})
export class FloorModule {}
