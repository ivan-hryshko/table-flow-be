import { User } from "../user/decorators/user.decorator";
import { AuthGuard } from "../user/guards/auth.guard";
import { UserEntity } from "../user/user.entity";
import { Body, Controller, Delete, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/createRestaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { RestaurantResponseInterface } from "./types/restaurantResponse.interface";
import { RestaurantsResponseInterface } from "./types/restaurantsResponse.interface";
import { DeleteResult } from "typeorm";
import { DeleteRestaurantDto } from "./dto/deleteRestaurant.dto";
import { UpdateRestaurantDto } from "./dto/updateRestaurant.dto";
import { BackendValidationPipe } from "../shared/pipes/backendValidation.pipe";

@Controller('api/v1')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('restaurant')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
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
  @UsePipes(new BackendValidationPipe())
  async delete (
    @User('id') currentUserId: number,
    @Body('restaurant') deleteRestaurantDto: DeleteRestaurantDto
    ): Promise<DeleteResult> {
    return await this.restaurantService.delete(deleteRestaurantDto, currentUserId)
  }

  @Put('restaurant')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update (
    @User('id') currentUserId: number,
    @Body('restaurant') updateRestaurantDto: UpdateRestaurantDto
    ): Promise<RestaurantResponseInterface> {
    const restaurant = await this.restaurantService.update(updateRestaurantDto, currentUserId)
    return this.restaurantService.buildRestaurantResponse(restaurant)
  }
}
