import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/model/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateRestaurantRequestDto } from './model/dtos/request/create-restaurant.request.dto';
import { DeleteRestaurantRequestDto } from './model/dtos/request/delete-restaurant.request.dto';
import { UpdateRestaurantRequestDto } from './model/dtos/request/update-restaurant.request.dto';
import { RestaurantResponseInterface } from './model/types/restaurantResponse.interface';
import { RestaurantsResponseInterface } from './model/types/restaurantsResponse.interface';
import { RestaurantService } from './services/restaurant.service';

@UseGuards(AuthGuard)
@Controller('api/v1')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('restaurant')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('restaurant') createRestaurantDto: CreateRestaurantRequestDto,
  ): Promise<RestaurantResponseInterface> {
    const restaurant = await this.restaurantService.create(
      currentUser,
      createRestaurantDto,
    );
    return this.restaurantService.buildRestaurantResponse(restaurant);
  }

  @Get('restaurants')
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<RestaurantsResponseInterface> {
    const restaurants = await this.restaurantService.getByUser({
      userId: currentUserId,
    });
    return this.restaurantService.buildRestaurantsResponse(restaurants);
  }

  @Delete('restaurant')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body('restaurant') deleteRestaurantDto: DeleteRestaurantRequestDto,
  ): Promise<DeleteResult> {
    return await this.restaurantService.delete(
      deleteRestaurantDto,
      currentUserId,
    );
  }

  @Put('restaurant')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body('restaurant') updateRestaurantDto: UpdateRestaurantRequestDto,
  ): Promise<RestaurantResponseInterface> {
    const restaurant = await this.restaurantService.update(
      updateRestaurantDto,
      currentUserId,
    );
    return this.restaurantService.buildRestaurantResponse(restaurant);
  }
}
