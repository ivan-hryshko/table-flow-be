import { PickType } from '@nestjs/swagger';

import { BaseFloorResponseDto } from './base-floor.response.dto';

export class UpdateFloorResponseDto extends PickType(BaseFloorResponseDto, [
  'id',
  'title',
  // 'imgSrc',
]) {}
