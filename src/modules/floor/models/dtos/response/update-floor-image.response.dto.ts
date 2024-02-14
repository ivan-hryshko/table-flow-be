import { PickType } from '@nestjs/swagger';

import { BaseFloorResponseDto } from './base-floor.response.dto';

export class UpdateFloorImageResponseDto extends PickType(BaseFloorResponseDto, [
  'id',
  'title',
  'imgSrc',
]) {}
