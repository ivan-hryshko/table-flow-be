import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantEntity } from "./restaurant.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
})
export class RestaurantModule {}
