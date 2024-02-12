import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { DeleteReserveRequestDto } from './delete-reserve.request.dto';

export class DeleteReserveWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => DeleteReserveRequestDto)
  reserve: DeleteReserveRequestDto;
}
