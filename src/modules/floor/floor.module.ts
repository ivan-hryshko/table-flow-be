import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { FloorController } from './floor.controller';
import { FloorEntity } from './floor.entity';
import { FloorService } from './services/floor.service';

@Module({
  imports: [TypeOrmModule.forFeature([FloorEntity]), RestaurantModule],
  controllers: [FloorController],
  providers: [FloorService, AuthGuard],
  exports: [FloorService],
})
export class FloorModule {}
