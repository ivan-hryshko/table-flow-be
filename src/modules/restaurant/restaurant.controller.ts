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
import { CreateRestaurantWrapperRequestDto } from './models/dtos/request/create-restaurant-wrapper.request.dto';
import { DeleteRestaurantWrapperRequestDto } from './models/dtos/request/delete-restaurant-wrapper.request.dto';
import { UpdateRestaurantWrapperRequestDto } from './models/dtos/request/update-restaurant-wrapper.request.dto';
import { CreateRestaurantWrapperResponseDto } from './models/dtos/response/create-restaurant-wrapper.response.dto';
import { UpdateRestaurantWrapperResponseDto } from './models/dtos/response/update-restaurant-wrapper.response.dto';
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
    @Body() createRestaurantDto: CreateRestaurantWrapperRequestDto,
  ): Promise<CreateRestaurantWrapperResponseDto> {
    const restaurant = await this.restaurantService.create(
      currentUser,
      createRestaurantDto.restaurant,
    );
    return this.restaurantService.buildRestaurantResponse(restaurant);
  }

  @Get('restaurants')
  @UseGuards(AuthGuard)
  async getAllByUserId(@User('id') currentUserId: number): Promise<any> {
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
    @Body() deleteRestaurantDto: DeleteRestaurantWrapperRequestDto,
  ): Promise<DeleteResult> {
    return await this.restaurantService.delete(
      deleteRestaurantDto.restaurant,
      currentUserId,
    );
  }

  @Put('restaurant')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body() updateRestaurantDto: UpdateRestaurantWrapperRequestDto,
  ): Promise<UpdateRestaurantWrapperResponseDto> {
    const restaurant = await this.restaurantService.update(
      updateRestaurantDto.restaurant,
      currentUserId,
    );
    return this.restaurantService.buildRestaurantResponse(restaurant);
  }
}
