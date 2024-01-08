import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateFloorRequestDto } from './create-floor.request.dto';

export class CreateFloorWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => CreateFloorRequestDto)
  floor: CreateFloorRequestDto;
}
