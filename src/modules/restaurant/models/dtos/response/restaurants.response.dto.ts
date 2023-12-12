import { RestaurantResponseDto } from './restaurant.response.dto';

export class RestaurantsResponseDto {
  restaurants: RestaurantResponseDto[];
  restaurantsCount: number;
}
