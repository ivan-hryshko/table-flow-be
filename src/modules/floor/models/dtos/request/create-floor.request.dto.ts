import { PickType } from '@nestjs/swagger';

import { BaseFloorRequestDto } from './base-floor.request.dto';

export class CreateFloorRequestDto extends PickType(BaseFloorRequestDto, [
  'title',
  'restaurantId',
]) {}
