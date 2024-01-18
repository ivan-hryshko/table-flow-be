import { PickType } from '@nestjs/swagger';

import { BaseReserveResponseDto } from './base-reserve.response.dto';

export class ReserveWithoutRelationsResponseDto extends PickType(
  BaseReserveResponseDto,
  [
    'id',
    'restaurantId',
    'reserveDate',
    'reserveStartTime',
    'reserveDurationTime',
    'countOfGuests',
    'tableId',
    'createAt',
    'updateAt',
  ],
) {}
