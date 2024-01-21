import { PickType } from '@nestjs/swagger';

import { BaseTableRequestDto } from './base-table.request.dto';

export class DeleteTableRequestDto extends PickType(BaseTableRequestDto, [
  'id',
]) {}
