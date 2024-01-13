import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UpdateFloorRequestDto } from './update-floor.request.dto';

export class UpdateFloorWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateFloorRequestDto)
  floor: UpdateFloorRequestDto;
}
