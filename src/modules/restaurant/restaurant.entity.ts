import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FloorEntity } from '../floor/floor.entity';
import { TableEntity } from '../table/table.entity';
import { UserEntity } from '../user/user.entity';
@Entity({ name: 'restaurants' })
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: '' })
  type: string;

  @Column({ default: '' })
  location: string;

  @ManyToOne(() => UserEntity, (user) => user.restaurants, { eager: true })
  user: UserEntity;

  @OneToMany(() => FloorEntity, (floor) => floor.restaurant)
  floors: FloorEntity[];

  @OneToMany(() => TableEntity, (table) => table.restaurant)
  tables: TableEntity[];
}
