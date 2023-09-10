import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";
import { TableEntity } from "@app/table/table.entity";
import { RestaurantEntity } from "@app/restaurant/restaurant.entity";
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
