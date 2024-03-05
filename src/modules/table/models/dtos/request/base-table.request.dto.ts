import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BaseTableRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  @IsInt()
  restaurantId: number;

  @IsNotEmpty()
  @IsInt()
  floorId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  seatsCount: number;
}
