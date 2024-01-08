import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateRestaurantRequestDto } from './create-restaurant.request.dto';

export class CreateRestaurantWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => CreateRestaurantRequestDto)
  restaurant: CreateRestaurantRequestDto;
}
