import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { IntegerValidationPipe } from '../../utils/pipes/integer-validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateRestaurantWrapperRequestDto } from './models/dtos/request/create-restaurant-wrapper.request.dto';
import { DeleteRestaurantWrapperRequestDto } from './models/dtos/request/delete-restaurant-wrapper.request.dto';
import { UpdateRestaurantWrapperRequestDto } from './models/dtos/request/update-restaurant-wrapper.request.dto';
import { CreateRestaurantWrapperResponseDto } from './models/dtos/response/create-restaurant-wrapper.response.dto';
import { RestaurantWrapperResponseDto } from './models/dtos/response/restaurant-wrapper.response.dto';
import { RestaurantsWithCountResponseDto } from './models/dtos/response/restaurants-with-count.response.dto';
import { UpdateRestaurantWrapperResponseDto } from './models/dtos/response/update-restaurant-wrapper.response.dto';
import { RestaurantService } from './services/restaurant.service';

@ApiTags('Restaurant')
@UseGuards(AuthGuard)
@Controller('api/v1/restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ description: 'Create restaurant' })
  @Post()
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

  @ApiOperation({ description: 'Get all restaurants by user' })
  @Get()
  @UseGuards(AuthGuard)
  async getAllByUserId(
    @User('id') currentUserId: number,
  ): Promise<RestaurantsWithCountResponseDto> {
    const restaurants = await this.restaurantService.getByUser({
      userId: currentUserId,
    });
    return this.restaurantService.buildRestaurantsResponse(restaurants);
  }

  @ApiOperation({ description: 'Get restaurant by user and restaurant id' })
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getByUserIdAndRestaurantId(
    @User('id') currentUserId: number,
    @Param('id', IntegerValidationPipe) restaurantId: number,
  ): Promise<RestaurantWrapperResponseDto> {
    const restaurant = await this.restaurantService.getByUserIdAndRestaurantId(
      restaurantId,
      currentUserId,
    );
    return this.restaurantService.buildRestaurantResponse(restaurant);
  }

  @ApiOperation({ description: 'Delete restaurant' })
  @Delete()
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

  @ApiOperation({ description: 'Update restaurant' })
  @Put()
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
