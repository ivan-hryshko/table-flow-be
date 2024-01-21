import { PickType } from '@nestjs/swagger';

import { BaseRestaurantRequestDto } from './base-restaurant.request.dto';

export class CreateRestaurantRequestDto extends PickType(
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
) {}
