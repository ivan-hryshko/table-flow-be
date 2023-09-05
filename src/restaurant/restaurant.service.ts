import { Injectable } from "@nestjs/common";
import { RestaurantEntity } from "./restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dto/createRestaurant.dto";
import { UserEntity } from "@app/user/user.entity";
import { RestaurantResponseInterface } from "./types/restaurantResponse.interface";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository:
    Repository<RestaurantEntity>
  ) {}

  buildRestaurantResponse(restaurant: RestaurantEntity): RestaurantResponseInterface {
    return {
      restaurant
    }
  }

  async create(currentUser: UserEntity, createRestaurantDto: CreateRestaurantDto): Promise<RestaurantEntity> {
    const newRestaurant = new RestaurantEntity()
    Object.assign(newRestaurant, createRestaurantDto)
    newRestaurant.user = currentUser
    return await this.restaurantRepository.save(newRestaurant)
  }


}