import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

import { BaseRestaurantRequestDto } from './base-restaurant.request.dto';

export class UpdateRestaurantRequestDto extends PartialType(
  PickType(BaseRestaurantRequestDto, [
    'type',
    'description',
    'city',
    'title',
    'description',
    'location',
    'openingTime',
    'closingTime',
  ]),
) {
  @IsNotEmpty()
  @Min(0)
  id: number;
}
