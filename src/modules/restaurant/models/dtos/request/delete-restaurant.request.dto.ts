import { PickType } from '@nestjs/swagger';

import { BaseRestaurantRequestDto } from './base-restaurant.request.dto';

export class DeleteRestaurantRequestDto extends PickType(
  BaseRestaurantRequestDto,
  ['id'],
) {}
