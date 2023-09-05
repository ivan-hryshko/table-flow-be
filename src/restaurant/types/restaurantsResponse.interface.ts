import { RestaurantEntity } from "../restaurant.entity";

export interface RestaurantsResponseInterface {
  restaurants: RestaurantEntity[],
  restaurantsCount: number,
}