import { PickType } from '@nestjs/swagger';

import { BaseTableResponseDto } from './base-table.response.dto';

export class TableForRestaurantResponseDto extends PickType(
  BaseTableResponseDto,
  ['id', 'title', 'x', 'y', 'isPlaced', 'seatsCount'],
) {}
