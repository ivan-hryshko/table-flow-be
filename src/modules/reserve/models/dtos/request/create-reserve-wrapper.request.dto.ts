import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateReserveRequestDto } from './create-reserve.request.dto';

export class CreateReserveWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => CreateReserveRequestDto)
  reserve: CreateReserveRequestDto;
}
