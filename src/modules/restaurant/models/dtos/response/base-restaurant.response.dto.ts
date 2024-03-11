import { FloorResponseDto } from '../../../../floor/models/dtos/response/floor.response.dto';
import { TableForRestaurantResponseDto } from '../../../../table/models/dtos/response/table-for-restaurant.response.dto';
import { UserForRestaurantResponseDto } from '../../../../user/models/dtos/response/user-for-restaurant.response.dto';

export class BaseRestaurantResponseDto {
  id: number;
  title: string;
  description: string;
  city: string;
  type: string;
  location: string;
  floors: any[];
  tables: TableForRestaurantResponseDto[];
  user: UserForRestaurantResponseDto;
  openingTime: string;
  closingTime: string;
  floorTitle: string;
}
