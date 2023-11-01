import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TableEntity } from "./table.entity";
import { TableController } from "./table.controller";
import { RestaurantModule } from "../restaurant/restaurant.modules";
import { TableService } from "./table.service";
import { AuthGuard } from "../user/guards/auth.guard";
import { FloorModule } from "../floor/floor.modules";

@Module({
  imports: [
    TypeOrmModule.forFeature([TableEntity]),
    RestaurantModule,
    FloorModule,
  ],
  controllers: [TableController],
  providers: [TableService, AuthGuard],
})
export class TableModule {}