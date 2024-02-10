import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BaseFloorRequestDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsInt()
  readonly restaurantId: number;
}
