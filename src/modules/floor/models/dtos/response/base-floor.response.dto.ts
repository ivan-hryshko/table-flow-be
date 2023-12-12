import { RestaurantResponseDto } from '../../../../restaurant/models/dtos/response/restaurant.response.dto';
import { TableEntity } from '../../../../table/table.entity';

export class BaseFloorResponseDto {
  id: number;
  title: string;
  restaurant: RestaurantResponseDto;
  tables: TableEntity[];
}
