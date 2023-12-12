import { FloorEntity } from '../../../../floor/floor.entity';
import { TableEntity } from '../../../../table/table.entity';
import { UserEntity } from '../../../../user/user.entity';

export class BaseRestaurantResponseDto {
  id: number;
  title: string;
  description: string;
  city: string;
  type: string;
  location: string;
  user: UserEntity;
  floors: FloorEntity[];
  tables: TableEntity[];
}
