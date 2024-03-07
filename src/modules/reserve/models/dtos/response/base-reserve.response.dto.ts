export class BaseReserveResponseDto {
  id: number;
  customerName: string;
  phone: string;
  comment: string;
  restaurantId: number;
  reserveDate: Date;
  reserveStartTime: Date;
  reserveDurationTime: number;
  countOfGuests: number;
  tableId: number;
  createAt: Date;
  updateAt: Date;
}
