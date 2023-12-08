import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '../auth/guards/auth.guard';
import { ReserveService } from './services/reserve.service';
import { ReserveController } from './reserve.controller';
import { ReserveEntity } from './reserve.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReserveEntity]),
    RestaurantModule,
  ],
  controllers: [ReserveController],
  providers: [ReserveService, AuthGuard],
})
export class ReserveModule {}
