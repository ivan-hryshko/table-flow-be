import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DeleteRestaurantRequestDto } from './delete-restaurant.request.dto';

export class DeleteRestaurantWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => DeleteRestaurantRequestDto)
  restaurant: DeleteRestaurantRequestDto;
}
