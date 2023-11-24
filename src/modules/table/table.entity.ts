import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FloorEntity } from '../floor/floor.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Entity({ name: 'tables' })
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: 0 })
  x: number;

  @Column({ default: 0 })
  y: number;

  @Column({ default: false })
  isPlaced: boolean;

  @Column({ default: 2 })
  seatsCount: number;

  @ManyToOne(() => FloorEntity, (floor) => floor.tables, { eager: true })
  floor: FloorEntity;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.tables, {
    eager: true,
  })
  restaurant: RestaurantEntity;
}
