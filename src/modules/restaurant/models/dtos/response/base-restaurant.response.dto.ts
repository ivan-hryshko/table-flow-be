import { FloorResponseDto } from '../../../../floor/models/dtos/response/floor.response.dto';
import { TableResponseDto } from '../../../../table/models/dtos/response/table.response.dto';

export class BaseRestaurantResponseDto {
  id: number;
  title: string;
  description: string;
  city: string;
  type: string;
  location: string;
  floors: FloorResponseDto[];
  tables: TableResponseDto[];
}
