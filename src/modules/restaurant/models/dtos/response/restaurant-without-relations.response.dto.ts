import { PickType } from '@nestjs/swagger';

import { BaseRestaurantResponseDto } from './base-restaurant.response.dto';

export class RestaurantWithoutRelationsResponseDto extends PickType(
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
