import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt'
import { RestaurantEntity } from "@app/restaurant/restaurant.entity";
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ default: '' })
  firstName: string

  @Column({ default: '' })
  lastName: string

  @Column({ default: '' })
  bio: string

  @Column({ default: '' })
  image: string

  @Column({ select: false })
  password: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10)
  }

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.user)
  restaurants: RestaurantEntity[]
}
