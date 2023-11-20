import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RestaurantController } from './restaurant.controller';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './services/restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  controllers: [RestaurantController],
  providers: [RestaurantService, AuthGuard],
  exports: [RestaurantService],
})
export class RestaurantModule {}
