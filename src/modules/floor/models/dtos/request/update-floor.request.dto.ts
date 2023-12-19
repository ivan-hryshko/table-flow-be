import { PickType } from '@nestjs/swagger';

import { BaseFloorRequestDto } from './base-floor.request.dto';

export class UpdateFloorRequestDto extends PickType(BaseFloorRequestDto, [
  'id',
]) {
  readonly title: string;
}
