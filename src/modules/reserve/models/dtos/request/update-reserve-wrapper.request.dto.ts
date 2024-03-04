import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UpdateReserveRequestDto } from './update-reserve.request.dto';

export class UpdateReserveWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateReserveRequestDto)
  reserve: UpdateReserveRequestDto;
}
