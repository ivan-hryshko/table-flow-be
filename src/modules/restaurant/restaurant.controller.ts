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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateRestaurantRequestDto } from './models/dtos/request/create-restaurant.request.dto';
import { DeleteRestaurantRequestDto } from './models/dtos/request/delete-restaurant.request.dto';
import { UpdateRestaurantRequestDto } from './models/dtos/request/update-restaurant.request.dto';
import { CreateRestaurantResponseDto } from './models/dtos/response/create-restaurant.response.dto';
import { RestaurantsResponseDto } from './models/dtos/response/restaurants.response.dto';
import { UpdateRestaurantResponseDto } from './models/dtos/response/update-restaurant.response.dto';
import { RestaurantService } from './services/restaurant.service';

@ApiTags('Restaurant')
@UseGuards(AuthGuard)
@Controller('api/v1')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ description: 'Create restaurant' })
  @Post('restaurants')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser,
    @Body() createRestaurantDto: CreateRestaurantRequestDto,
  ): Promise<CreateRestaurantResponseDto> {
    return await this.restaurantService.create(
      currentUser,
      createRestaurantDto,
    );
  }

  @Get('restaurants')
  @UseGuards(AuthGuard)
  async getAllByUserId(
    @User('id') currentUserId: number,
  ): Promise<RestaurantsResponseDto> {
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
    @Body() deleteRestaurantDto: DeleteRestaurantRequestDto,
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
    @Body() updateRestaurantDto: UpdateRestaurantRequestDto,
  ): Promise<UpdateRestaurantResponseDto> {
    return await this.restaurantService.update(
      updateRestaurantDto,
      currentUserId,
    );
  }
}
