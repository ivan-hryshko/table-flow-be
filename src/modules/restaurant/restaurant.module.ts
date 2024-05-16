import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RestaurantController } from './restaurant.controller';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './services/restaurant.service';
import { FloorModule } from '../floor/floor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    forwardRef(() => FloorModule),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, AuthGuard],
  exports: [RestaurantService],
})
export class RestaurantModule {}
