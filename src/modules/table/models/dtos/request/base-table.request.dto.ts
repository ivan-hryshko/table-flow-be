import { IsNotEmpty } from 'class-validator';

export class BaseTableRequestDto {
  @IsNotEmpty()
  restaurantId: number;

  @IsNotEmpty()
  floorId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  seatsCount: number;
}
