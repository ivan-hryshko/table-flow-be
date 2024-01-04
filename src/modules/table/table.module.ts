import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FloorModule } from '../floor/floor.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { TableService } from './services/table.service';
import { TableController } from './table.controller';
import { TableEntity } from './table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableEntity]),
    RestaurantModule,
    FloorModule,
  ],
  controllers: [TableController],
  providers: [TableService, AuthGuard],
  exports: [TableService],
})
export class TableModule {}
