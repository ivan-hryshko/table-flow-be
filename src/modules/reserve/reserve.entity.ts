import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RestaurantEntity } from "../restaurant/restaurant.entity";

@Entity({ name: 'reserves' })
export class ReserveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  reserveDate: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  reserveStartTime: Date;

  @Column({ default: 3 })
  reserveDurationTime: number;

  @Column({ default: 1 })
  countOfGuests: number;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.reserves, { eager: true })
  restaurant: RestaurantEntity;
}
