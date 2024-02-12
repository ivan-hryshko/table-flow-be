import { ReserveWithoutRelationsResponseDto } from './reserve-without-relations.response.dto';

export class ReservesWithCountResponseDto {
  reserves: ReserveWithoutRelationsResponseDto[];
  reservesCount: number;
}
