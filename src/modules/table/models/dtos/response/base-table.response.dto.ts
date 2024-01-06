import { FloorResponseDto } from '../../../../floor/models/dtos/response/floor.response.dto';
import { RestaurantResponseDto } from '../../../../restaurant/models/dtos/response/restaurant.response.dto';

export class BaseTableRequestDto {
  id: number;
  title: string;
  x: number;
  y: number;
  isPlaced: boolean;
  seatsCount: number;
  floor: FloorResponseDto;
  restaurant: RestaurantResponseDto;
}
