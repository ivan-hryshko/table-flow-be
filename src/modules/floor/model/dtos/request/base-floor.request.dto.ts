import { IsNotEmpty } from 'class-validator';

export class BaseFloorRequestDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly restaurantId: number;
}
