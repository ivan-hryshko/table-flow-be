import { Column } from 'typeorm';

export class BaseReserveResponseDto {
  // name: string;
  // phone: string;
  // comment: string;
  restaurantId: number;
  reserveDate: Date;
  reserveStartTime: Date;
  reserveDurationTime: number;
  countOfGuests: number;
  tableId: number;
  id: number;
  createAt: Date;
  updateAt: Date;
}
