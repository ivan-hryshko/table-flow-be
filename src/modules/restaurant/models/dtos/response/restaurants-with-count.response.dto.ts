import { RestaurantResponseDto } from './restaurant.response.dto';

export class RestaurantsWithCountResponseDto {
  restaurants: RestaurantResponseDto[];
  restaurantsCount: number;
}
