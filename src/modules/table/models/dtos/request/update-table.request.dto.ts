import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { BaseTableRequestDto } from './base-table.request.dto';

export class UpdateTableRequestDto extends PickType(BaseTableRequestDto, [
  'floorId',
  'title',
  'seatsCount',
]) {
  @IsNotEmpty()
  readonly id: number;
}
