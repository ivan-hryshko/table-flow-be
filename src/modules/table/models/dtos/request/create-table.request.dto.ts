import { PickType } from '@nestjs/swagger';

import { BaseTableRequestDto } from './base-table.request.dto';

export class CreateTableRequestDto extends PickType(BaseTableRequestDto, [
  'seatsCount',
  'floorId',
  'title',
  'restaurantId',
]) {}
