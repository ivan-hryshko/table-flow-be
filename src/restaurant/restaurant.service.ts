import { Injectable } from "@nestjs/common";
import { RestaurantEntity } from "./restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dto/createRestaurant.dto";
import { UserEntity } from "@app/user/user.entity";
import { RestaurantResponseInterface } from "./types/restaurantResponse.interface";
import { RestaurantQueryParams } from "./types/restaurantQuery.types";
import { RestaurantsResponseInterface } from "./types/restaurantsResponse.interface";

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

  buildRestaurantsResponse(restaurants: RestaurantEntity[]): RestaurantsResponseInterface {
    return {
      restaurants,
      restaurantsCount: restaurants.length,
    }
  }

  async create(currentUser: UserEntity, createRestaurantDto: CreateRestaurantDto): Promise<RestaurantEntity> {
    const newRestaurant = new RestaurantEntity()
    Object.assign(newRestaurant, createRestaurantDto)
    newRestaurant.user = currentUser
    return await this.restaurantRepository.save(newRestaurant)
  }

  async getByUser(query: RestaurantQueryParams) {
    return this.restaurantRepository
      .createQueryBuilder("restaurant")
      .innerJoinAndSelect("restaurant.user", "user")
      .where('user.id = :userId', { userId: query.userId })
      .getMany()
  }

  async getById(restaurantId: number) {
    return this.restaurantRepository.findOne({ id: restaurantId})
  }
}
