import { PickType } from '@nestjs/swagger';

import { BaseRestaurantResponseDto } from './base-restaurant.response.dto';

export class CreateRestaurantResponseDto extends PickType(
  BaseRestaurantResponseDto,
  [
    'id',
    'title',
    'description',
    'city',
    'type',
    'location',
    'openingTime',
    'closingTime',
    'floorTitle',
  ],
) {}
