import { PickType } from '@nestjs/swagger';

import { BaseReserveResponseDto } from './base-reserve.response.dto';

export class ReserveResponseDto extends PickType(BaseReserveResponseDto, [
  'id',
  'customerName',
  'phone',
  'comment',
  'restaurantId',
  'reserveDate',
  'reserveStartTime',
  'reserveDurationTime',
  'countOfGuests',
  'tableId',
  'createAt',
  'updateAt',
]) {}
