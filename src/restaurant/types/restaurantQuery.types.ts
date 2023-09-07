import { UserEntity } from "@app/user/user.entity"

export type RestaurantQueryParams = {
  userId?: number
  user?: UserEntity
}
