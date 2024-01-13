import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateTableRequestDto } from './create-table.request.dto';

export class CreateTableWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => CreateTableRequestDto)
  table: CreateTableRequestDto;
}
