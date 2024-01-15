import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DeleteFloorRequestDto } from './delete-floor.request.dto';

export class DeleteFloorWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => DeleteFloorRequestDto)
  floor: DeleteFloorRequestDto;
}
