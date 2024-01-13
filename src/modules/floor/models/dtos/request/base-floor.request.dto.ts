import { IsNotEmpty, Min } from 'class-validator';

export class BaseFloorRequestDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly restaurantId: number;
}
