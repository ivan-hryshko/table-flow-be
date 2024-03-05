import { PickType } from '@nestjs/swagger';

import { BaseReserveResponseDto } from './base-reserve.response.dto';

export class CreateReserveResponseDto extends PickType(BaseReserveResponseDto, [
  'id',
  // 'name',
  // 'phone',
  // 'comment',
  'restaurantId',
  'reserveDate',
  'reserveStartTime',
  'reserveDurationTime',
  'countOfGuests',
  'tableId',
  'createAt',
  'updateAt',
]) {}
