import { RestaurantResponseDto } from '../../../../restaurant/models/dtos/response/restaurant.response.dto';
import { TableResponseDto } from '../../../../table/models/dtos/response/table.response.dto';

export class BaseFloorResponseDto {
  id: number;
  title: string;
  restaurant: RestaurantResponseDto;
  tables: TableResponseDto[];
  imgSrc: string;
}
