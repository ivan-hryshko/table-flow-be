import { ReserveEntity } from '../../reserve.entity';

export interface ReservesResponseInterface {
  reserves: ReserveEntity[];
  reservesCount: number;
}
