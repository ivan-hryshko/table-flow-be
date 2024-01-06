import { PickType } from '@nestjs/swagger';

import { BaseFloorRequestDto } from './base-floor.request.dto';

export class DeleteFloorRequestDto extends PickType(BaseFloorRequestDto, [
  'id',
]) {}
