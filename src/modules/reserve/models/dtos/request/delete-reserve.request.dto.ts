import { PickType } from '@nestjs/swagger';

import { BaseReserveRequestDto } from './base-reserve.request.dto';

export class DeleteReserveRequestDto extends PickType(BaseReserveRequestDto, [
  'id',
]) {}
