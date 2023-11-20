import { IsNotEmpty } from 'class-validator';

export class BaseTableRequestDto {
  @IsNotEmpty()
  readonly restaurantId: number;

  @IsNotEmpty()
  readonly floorId: number;

  readonly title: string;

  readonly seatsCount: number;
}
