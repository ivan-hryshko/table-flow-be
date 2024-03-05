import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TableEntity } from '../table/table.entity';

@Entity({ name: 'reserves' })
export class ReserveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // name: string;
  //
  // @Column()
  // phone: string;
  //
  // @Column()
  // comment: string;

  @Column()
  restaurantId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  reserveDate: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  reserveStartTime: Date;

  @Column({ default: 3 })
  reserveDurationTime: number;

  @Column({ default: 1 })
  countOfGuests: number;

  @Column({ default: null })
  tableId: number;

  @ManyToOne(() => TableEntity, (table) => table.reserves)
  table: TableEntity;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
