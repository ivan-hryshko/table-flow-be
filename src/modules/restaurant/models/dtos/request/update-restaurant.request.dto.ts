import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { BaseRestaurantRequestDto } from './base-restaurant.request.dto';

export class UpdateRestaurantRequestDto extends PickType(
  BaseRestaurantRequestDto,
  [
    'title',
    'city',
    'type',
    'description',
    'location',
    'openingTime',
    'closingTime',
  ],
) {
  @IsNotEmpty()
  readonly id: number;
}
