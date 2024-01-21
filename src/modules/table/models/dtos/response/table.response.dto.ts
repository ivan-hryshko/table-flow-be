import { PickType } from '@nestjs/swagger';

import { BaseTableRequestDto } from './base-table.response.dto';

export class TableResponseDto extends PickType(BaseTableRequestDto, [
  'id',
  'title',
  'x',
  'y',
  'isPlaced',
  'seatsCount',
  'restaurantId',
  'floorId',
]) {}
