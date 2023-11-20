import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { BaseRestaurantRequestDto } from './base-restaurant.request.dto';

export class UpdateRestaurantRequestDto extends PickType(
  BaseRestaurantRequestDto,
  ['title', 'city', 'type', 'description', 'location'],
) {
  @IsNotEmpty()
  readonly id: number;
}
