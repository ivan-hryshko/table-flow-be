import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/createRestaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { RestaurantResponseInterface } from "./types/restaurantResponse.interface";

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

}