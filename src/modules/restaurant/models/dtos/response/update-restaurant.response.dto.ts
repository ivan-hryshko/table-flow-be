import { PickType } from '@nestjs/swagger';

import { BaseRestaurantResponseDto } from './base-restaurant.response.dto';

export class UpdateRestaurantResponseDto extends PickType(
  BaseRestaurantResponseDto,
  [
    'id',
    'title',
    'description',
    'city',
    'type',
    'location',
    'floors',
    'tables',
    'openingTime',
    'closingTime',
  ],
) {}
