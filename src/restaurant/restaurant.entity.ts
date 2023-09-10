import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";
import { TableEntity } from "@app/table/table.entity";
import { FloorEntity } from "@app/floor/floor.entity";
@Entity({ name: 'restaurants' })
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: '' })
  title: string

  @Column({ default: '' })
  description: string

  @Column({ default: '' })
  location: string

  @ManyToOne(() => UserEntity, (user) => user.restaurants, { eager: true })
  user: UserEntity

  @OneToMany(() => FloorEntity, (floor) => floor.restaurant)
  floors: FloorEntity[]

  @OneToMany(() => TableEntity, (table) => table.restaurant)
  tables: TableEntity[]
}
