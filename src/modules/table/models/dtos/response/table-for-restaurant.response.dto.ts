import { PickType } from '@nestjs/swagger';

import { BaseTableRequestDto } from './base-table.response.dto';

export class TableForRestaurantResponseDto extends PickType(
  BaseTableRequestDto,
  ['id', 'title', 'x', 'y', 'isPlaced', 'seatsCount'],
) {}
