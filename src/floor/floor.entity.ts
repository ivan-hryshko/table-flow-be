import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { TableEntity } from "../table/table.entity";
import { RestaurantEntity } from "../restaurant/restaurant.entity";
@Entity({ name: 'floors' })
export class FloorEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: '' })
  title: string

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.floors, { eager: true })
  restaurant: RestaurantEntity

  @OneToMany(() => TableEntity, (table) => table.floor)
  tables: TableEntity[]
}
