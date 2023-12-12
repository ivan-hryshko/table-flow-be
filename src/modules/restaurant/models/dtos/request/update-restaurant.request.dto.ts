import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { BaseRestaurantRequestDto } from './base-restaurant.request.dto';

export class UpdateRestaurantRequestDto extends PartialType(
  BaseRestaurantRequestDto,
) {
  @IsNotEmpty()
  readonly id: number;
}
