import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/createRestaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { RestaurantResponseInterface } from "./types/restaurantResponse.interface";
import { RestaurantsResponseInterface } from "./types/restaurantsResponse.interface";
import { DeleteResult } from "typeorm";
import { DeleteRestaurantDto } from "./dto/deleteRestaurant.dto";

@Controller('api/v1')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('restaurant')
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('restaurant') createRestaurantDto: CreateRestaurantDto
  ): Promise<RestaurantResponseInterface> {
    const restaurant = await this.restaurantService.create(currentUser, createRestaurantDto)
    return this.restaurantService.buildRestaurantResponse(restaurant)
  }

  @Get('restaurants')
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<RestaurantsResponseInterface> {
    const restaurants = await this.restaurantService.getByUser({ userId: currentUserId })
    return this.restaurantService.buildRestaurantsResponse(restaurants)
  }

  @Delete('restaurant')
  @UseGuards(AuthGuard)
  async delete (
    @User('id') currentUserId: number,
    @Body('restaurant') deleteRestaurantDto: DeleteRestaurantDto
    ): Promise<DeleteResult> {
    return await this.restaurantService.delete(deleteRestaurantDto, currentUserId)
  }
}
