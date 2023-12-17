import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TableEntity } from '../table/table.entity';

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

  @Column({ default: null })
  tableId: number;

  @OneToOne(() => TableEntity, (table) => table.reserve, { eager: true })
  table: TableEntity;
}
