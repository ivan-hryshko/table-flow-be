import { PickType } from '@nestjs/swagger';

import { BaseFloorResponseDto } from './base-floor.response.dto';

export class FloorResponseDto extends PickType(BaseFloorResponseDto, [
  'id',
  'title',
  'restaurant',
  'tables',
]) {}
