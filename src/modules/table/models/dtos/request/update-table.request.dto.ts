import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

import { BaseTableRequestDto } from './base-table.request.dto';

export class UpdateTableRequestDto extends PartialType(
  PickType(BaseTableRequestDto, ['floorId', 'title', 'seatsCount']),
) {
  @IsNotEmpty()
  @Min(0)
  id: number;
}
