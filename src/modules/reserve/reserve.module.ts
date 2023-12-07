import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '../auth/guards/auth.guard';
import { TableModule } from '../table/table.module';
import { TableService } from '../table/services/table.service';
import { ReserveService } from './services/reserve.service';
import { ReserveController } from './reserve.controller';
import { ReserveEntity } from './reserve.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { FloorModule } from '../floor/floor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReserveEntity]),
    TableModule,
    RestaurantModule,
    FloorModule,
  ],
  controllers: [ReserveController],
  providers: [ReserveService, AuthGuard, TableService],
})
export class ReserveModule {}
