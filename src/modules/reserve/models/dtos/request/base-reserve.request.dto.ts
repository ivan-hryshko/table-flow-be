import { IsNotEmpty } from 'class-validator';

export class BaseReserveRequestDto {
  @IsNotEmpty()
  readonly tableId: number;

  readonly reserveDate: Date;

  readonly reserveStartTime: Date;

  readonly reserveDurationTime: number;

  readonly countOfGuests: number;

}
