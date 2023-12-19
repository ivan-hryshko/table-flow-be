import { FloorResponseDto } from '../../../../floor/models/dtos/response/floor.response.dto';
import { TableResponseDto } from '../../../../table/models/dtos/response/table.response.dto';
import { UserEntity } from '../../../../user/user.entity';

export class BaseRestaurantResponseDto {
  id: number;
  title: string;
  description: string;
  city: string;
  type: string;
  location: string;
  user: UserEntity;
  floors: FloorResponseDto[];
  tables: TableResponseDto[];
}
