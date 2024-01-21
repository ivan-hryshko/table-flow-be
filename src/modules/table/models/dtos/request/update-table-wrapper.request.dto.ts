import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UpdateTableRequestDto } from './update-table.request.dto';

export class UpdateTableWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateTableRequestDto)
  table: UpdateTableRequestDto;
}
