import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FloorEntity } from '../floor/floor.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { ReserveEntity } from '../reserve/reserve.entity';

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

  @Column({ nullable: true })
  restaurantId: number;

  @Column({ nullable: true })
  floorId: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => FloorEntity, (floor) => floor.tables, { eager: true })
  floor: FloorEntity;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.tables, {
    eager: true,
  })
  restaurant: RestaurantEntity;

  @OneToMany(() => ReserveEntity, (reserve) => reserve.table)
  reserves: ReserveEntity[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
