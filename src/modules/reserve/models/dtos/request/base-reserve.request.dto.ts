import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Column } from 'typeorm';

export class BaseReserveRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  // @IsNotEmpty()
  // name: string;
  //
  // @IsNotEmpty()
  // phone: string;
  //
  // @IsNotEmpty()
  // comment: string;

  @IsNotEmpty()
  @Min(0)
  @IsInt()
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
