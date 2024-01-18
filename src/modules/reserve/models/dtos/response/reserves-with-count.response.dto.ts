import { ReserveWithoutRelationsResponseDto } from './reserve-without-relations.response.dto';

export class ReservesWithCountResponseDto {
  restaurants: ReserveWithoutRelationsResponseDto[];
  restaurantsCount: number;
}
