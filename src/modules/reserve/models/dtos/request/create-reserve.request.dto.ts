import { PickType } from '@nestjs/swagger';

import { BaseReserveRequestDto } from './base-reserve.request.dto';

export class CreateReserveRequestDto extends PickType(BaseReserveRequestDto, [
  'tableId',
  'reserveDate',
  'reserveStartTime',
  'reserveDurationTime',
  'countOfGuests',
]) {}
