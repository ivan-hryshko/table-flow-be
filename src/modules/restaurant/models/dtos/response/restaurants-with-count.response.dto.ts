import { RestaurantWithoutRelationsResponseDto } from './restaurant-without-relations.response.dto';

export class RestaurantsWithCountResponseDto {
  restaurants: RestaurantWithoutRelationsResponseDto[];
  restaurantsCount: number;
}
