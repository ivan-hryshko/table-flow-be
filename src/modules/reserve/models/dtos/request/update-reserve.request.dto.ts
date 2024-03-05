import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

import { BaseReserveRequestDto } from './base-reserve.request.dto';

export class UpdateReserveRequestDto extends PartialType(
  PickType(BaseReserveRequestDto, [
    // 'name',
    // 'phone',
    // 'comment',
    'restaurantId',
    'reserveDate',
    'reserveStartTime',
    'reserveDurationTime',
    'countOfGuests',
  ]),
) {
  @IsNotEmpty()
  @Min(0)
  id: number;
}
