import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";
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
}
