import { PickType } from '@nestjs/swagger';

import { BaseReserveRequestDto } from './base-reserve.request.dto';
import { Column } from 'typeorm';

export class CreateReserveRequestDto extends PickType(BaseReserveRequestDto, [
  // 'name',
  // 'phone',
  // 'comment',
  'restaurantId',
  'reserveDate',
  'reserveStartTime',
  'reserveDurationTime',
  'countOfGuests',
]) {}
