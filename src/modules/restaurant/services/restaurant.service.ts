import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { UserEntity } from '../../user/user.entity';
import { CreateRestaurantRequestDto } from '../models/dtos/request/create-restaurant.request.dto';
import { DeleteRestaurantRequestDto } from '../models/dtos/request/delete-restaurant.request.dto';
import { UpdateRestaurantRequestDto } from '../models/dtos/request/update-restaurant.request.dto';
import { CreateRestaurantResponseDto } from '../models/dtos/response/create-restaurant.response.dto';
import { RestaurantsWithCountResponseDto } from '../models/dtos/response/restaurants-with-count.response.dto';
import { RestaurantQueryParams } from '../models/types/restaurantQuery.types';
import { RestaurantEntity } from '../restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}
  buildRestaurantResponse(restaurant: RestaurantEntity): {
    restaurant: RestaurantEntity;
  } {
    return {
      restaurant,
    };
  }

  buildRestaurantsResponse(
    restaurants: RestaurantEntity[],
  ): RestaurantsWithCountResponseDto {
    return {
      restaurants,
      restaurantsCount: restaurants.length,
    };
  }

  async create(
    currentUser: UserEntity,
    createRestaurantDto: CreateRestaurantRequestDto,
  ): Promise<CreateRestaurantResponseDto> {
    const newRestaurant = new RestaurantEntity();
    Object.assign(newRestaurant, createRestaurantDto);
    newRestaurant.user = currentUser;
    return await this.restaurantRepository.save(newRestaurant);
  }

  async getByUser(query: RestaurantQueryParams) {
    return (
      this.restaurantRepository
        .createQueryBuilder('restaurant')
        .innerJoin('restaurant.user', 'user')
        // .innerJoin("restaurant.floors", "floors")
        .addSelect(['user.id', 'user.firstName', 'user.lastName'])
        // .addSelect('floors')
        .where('user.id = :userId', { userId: query.userId })
        .getMany()
    );
  }

  async getById(restaurantId: number) {
    return this.restaurantRepository
      .createQueryBuilder('restaurant')
      .innerJoin('restaurant.user', 'user')
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .where('restaurant.id = :restaurantId', { restaurantId })
      .getOne();
  }

  async delete(
    deleteRestaurantDto: DeleteRestaurantRequestDto,
    currentUserId: number,
  ) {
    const errorHelper = new ErrorHelper();
    const restaurant = await this.getById(deleteRestaurantDto.id);

    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторан з заданим id:${deleteRestaurantDto.id} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (restaurant.user.id !== currentUserId) {
      errorHelper.addNewError(`Ви не є автором ресторану`, 'owner');
      throw new HttpException(errorHelper.getErrors(), HttpStatus.FORBIDDEN);
    }

    return this.restaurantRepository.delete({ id: deleteRestaurantDto.id });
  }

  async update(
    updateRestaurantDto: UpdateRestaurantRequestDto,
    currentUserId: number,
  ) {
    const errorHelper = new ErrorHelper();
    const restaurant = await this.getById(updateRestaurantDto.id);

    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторан з заданим id:${updateRestaurantDto.id} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (restaurant.user.id !== currentUserId) {
      errorHelper.addNewError(`Ви не є автором ресторану`, 'owner');
      throw new HttpException(errorHelper.getErrors(), HttpStatus.FORBIDDEN);
    }

    Object.assign(restaurant, updateRestaurantDto);

    return this.restaurantRepository.save(restaurant);
  }
}
