import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DeleteTableRequestDto } from './delete-table.request.dto';

export class DeleteTableWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => DeleteTableRequestDto)
  table: DeleteTableRequestDto;
}
