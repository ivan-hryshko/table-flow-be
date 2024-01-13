import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UpdateRestaurantRequestDto } from './update-restaurant.request.dto';

export class UpdateRestaurantWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateRestaurantRequestDto)
  restaurant: UpdateRestaurantRequestDto;
}
