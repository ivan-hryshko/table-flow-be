import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { UserEntity } from '../../user/user.entity';
import { CreateRestaurantRequestDto } from '../models/dtos/request/create-restaurant.request.dto';
import { DeleteRestaurantRequestDto } from '../models/dtos/request/delete-restaurant.request.dto';
import { UpdateRestaurantRequestDto } from '../models/dtos/request/update-restaurant.request.dto';
import { RestaurantsWithCountResponseDto } from '../models/dtos/response/restaurants-with-count.response.dto';
import { RestaurantQueryParams } from '../models/types/restaurantQuery.types';
import { RestaurantEntity } from '../restaurant.entity';
import { FloorService } from '../../floor/services/floor.service';
import { FloorEntity } from '../../floor/floor.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @Inject(forwardRef(() => FloorService))
    private readonly floorService: FloorService,
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

  // зміна
  async create(
    currentUser: UserEntity,
    createRestaurantDto: CreateRestaurantRequestDto,
  ): Promise<RestaurantEntity> {
    const newRestaurant = new RestaurantEntity();
    Object.assign(newRestaurant, createRestaurantDto);
    newRestaurant.user = currentUser;

    if ('floorTitle' in newRestaurant) {
      delete newRestaurant.floorTitle;
    }

    const restaurant: RestaurantEntity =
      await this.restaurantRepository.save(newRestaurant);

    const floor = await this.floorService.create(currentUser.id, {
      title: createRestaurantDto.floorTitle || 'default Title',
      restaurantId: restaurant.id,
    });

    restaurant.floors = [floor];

    return restaurant;
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

  async getByUserIdAndRestaurantId(
    restaurantId: number,
    userId: number,
  ): Promise<RestaurantEntity> {
    const errorHelper = new ErrorHelper();

    const restaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .innerJoin('restaurant.user', 'user')
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .leftJoin('restaurant.floors', 'floors')
      .addSelect(['floors.id', 'floors.title'])
      .leftJoin('restaurant.tables', 'tables')
      .addSelect([
        'tables.id',
        'tables.title',
        'tables.x',
        'tables.y',
        'tables.isPlaced',
        'tables.seatsCount',
      ])
      .getOne();

    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторану з заданим id:${restaurantId} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (restaurant.user.id !== userId) {
      errorHelper.addNewError(`Ви не є автором ресторану`, 'restaurant');
      throw new HttpException(errorHelper.getErrors(), HttpStatus.FORBIDDEN);
    }

    return restaurant;
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
  ): Promise<RestaurantEntity> {
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

  async validateRestaurantOwnership(
    currentUserId: number,
    restaurantId: number,
  ): Promise<RestaurantEntity> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const restaurant: RestaurantEntity = await this.getById(restaurantId);

    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторан з заданим id:${restaurantId} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (restaurant.user.id !== currentUserId) {
      errorHelper.addNewError(`Ви не є власником ресторану!`, 'owner');
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return restaurant;
  }
}
