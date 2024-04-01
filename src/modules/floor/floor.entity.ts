import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { TableEntity } from '../table/table.entity';
@Entity({ name: 'floors' })
export class FloorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ nullable: true })
  restaurantId: number;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.floors, {
    eager: true,
  })
  restaurant: RestaurantEntity;

  @OneToMany(() => TableEntity, (table) => table.floor, { onDelete: 'CASCADE' })
  tables: TableEntity[];

  @Column({ nullable: true })
  imgKey: string;

  // @Column({ nullable: true })
  // imgSrc: string;
}
