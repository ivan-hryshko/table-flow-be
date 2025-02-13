import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

import { BaseFloorRequestDto } from './base-floor.request.dto';

export class UpdateFloorRequestDto extends PartialType(
  PickType(BaseFloorRequestDto, ['title']),
) {
  @IsNotEmpty()
  @Min(0)
  id: number;
}
