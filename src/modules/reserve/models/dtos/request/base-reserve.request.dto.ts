import { IsNotEmpty, Min } from 'class-validator';

export class BaseReserveRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  @Min(0)
  restaurantId: number;

  @IsNotEmpty()
  reserveDate: Date;

  @IsNotEmpty()
  reserveStartTime: Date;

  @IsNotEmpty()
  reserveDurationTime: number;

  @IsNotEmpty()
  @Min(1)
  countOfGuests: number;
}
