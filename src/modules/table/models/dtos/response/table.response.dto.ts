import { PickType } from '@nestjs/swagger';

import { BaseTableResponseDto } from './base-table.response.dto';

export class TableResponseDto extends PickType(BaseTableResponseDto, [
  'id',
  'title',
  'x',
  'y',
  'isPlaced',
  'seatsCount',
  'restaurantId',
  'floorId',
]) {}
