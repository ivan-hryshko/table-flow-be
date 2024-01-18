import { IsNotEmpty, Min } from 'class-validator';

export class BaseTableRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  restaurantId: number;

  @IsNotEmpty()
  floorId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  seatsCount: number;
}
