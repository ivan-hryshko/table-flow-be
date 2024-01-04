import { IsNotEmpty } from 'class-validator';

export class BaseReserveRequestDto {
  @IsNotEmpty()
  readonly restaurantId: number;

  readonly reserveDate: Date;

  readonly reserveStartTime: Date;

  readonly reserveDurationTime: number; //TODO додати дефолтне значення

  readonly countOfGuests: number;
}
