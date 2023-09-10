import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RestaurantEntity } from "./restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dto/createRestaurant.dto";
import { UserEntity } from "@app/user/user.entity";
import { RestaurantResponseInterface } from "./types/restaurantResponse.interface";
import { RestaurantQueryParams } from "./types/restaurantQuery.types";
import { RestaurantsResponseInterface } from "./types/restaurantsResponse.interface";
import { DeleteRestaurantDto } from "./dto/deleteRestaurant.dto";
import { UpdateRestaurantDto } from "./dto/updateRestaurant.dto";

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
      .innerJoin("restaurant.user", "user")
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .where('user.id = :userId', { userId: query.userId })
      .getMany()
  }

  async getById(restaurantId: number) {
    return this.restaurantRepository.findOne({ id: restaurantId})
  }

  async delete(deleteRestaurantDto: DeleteRestaurantDto, currentUserId: number) {
    const restaurant = await this.getById(deleteRestaurantDto.id)

    if (!restaurant) {
      throw new HttpException('Restaurant does not exist', HttpStatus.NOT_FOUND)
    }

    if (restaurant.user.id !== currentUserId) {
      throw new HttpException('You are not author of restaurant', HttpStatus.FORBIDDEN)
    }

    return this.restaurantRepository.delete({ id: deleteRestaurantDto.id })
  }

  async update(updateRestaurantDto: UpdateRestaurantDto, currentUserId: number) {
    const restaurant = await this.getById(updateRestaurantDto.id)

    if (!restaurant) {
      throw new HttpException('Restaurant does not exist', HttpStatus.NOT_FOUND)
    }

    if (restaurant.user.id !== currentUserId) {
      throw new HttpException('You are not author of restaurant', HttpStatus.FORBIDDEN)
    }

    Object.assign(restaurant, updateRestaurantDto)

    return this.restaurantRepository.save(restaurant)
  }
}
