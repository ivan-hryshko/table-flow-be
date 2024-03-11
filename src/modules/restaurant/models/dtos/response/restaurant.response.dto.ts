import { PickType } from '@nestjs/swagger';

import { BaseRestaurantResponseDto } from './base-restaurant.response.dto';

export class RestaurantResponseDto extends PickType(BaseRestaurantResponseDto, [
  'id',
  'title',
  'description',
  'city',
  'type',
  'location',
  'openingTime',
  'closingTime',
  'floorTitle',
  'floors',
  'tables',
  'user',
]) {}
