import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BaseFloorRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsInt()
  restaurantId: number;
}
