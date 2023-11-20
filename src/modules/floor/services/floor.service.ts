import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { UserEntity } from '../../user/user.entity';
import { FloorEntity } from '../floor.entity';
import { CreateFloorRequestDto } from '../model/dtos/request/create-floor.request.dto';
import { DeleteFloorRequestDto } from '../model/dtos/request/delete-floor.request.dto';
import { UpdateFloorRequestDto } from '../model/dtos/request/update-floor.request.dto';
import { FloorQueryParams } from '../model/types/floorQuery.types';
import { FloorResponseInterface } from '../model/types/floorResponse.interface';
import { FloorsResponseInterface } from '../model/types/floorsResponse.interface';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private readonly floorRepository: Repository<FloorEntity>,
    private readonly restaurantService: RestaurantService,
  ) {}

  buildFloorResponse(floor: FloorEntity): FloorResponseInterface {
    return {
      floor,
    };
  }

  buildFloorsResponse(floors: FloorEntity[]): FloorsResponseInterface {
    return {
      floors,
      floorsCount: floors.length,
    };
  }

  async create(
    currentUser: UserEntity,
    createFloorDto: CreateFloorRequestDto,
  ): Promise<FloorEntity> {
    const newFloor = new FloorEntity();
    newFloor.title = createFloorDto.title;
    const restaurant = await this.restaurantService.getById(
      createFloorDto.restaurantId,
    );

    if (!restaurant) {
      throw new HttpException(
        'Restaurant does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (restaurant.user.id !== currentUser.id) {
      throw new HttpException(
        'You are not author of restaurant',
        HttpStatus.FORBIDDEN,
      );
    }
    newFloor.restaurant = restaurant;
    return await this.floorRepository.save(newFloor);
  }

  async getByUser(query: FloorQueryParams) {
    return this.floorRepository
      .createQueryBuilder('floor')
      .innerJoin('floor.user', 'user')
      .innerJoin('floor.restaurant', 'restaurant')
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .addSelect(['restaurant.id', 'restaurant.title'])
      .where('user.id = :userId', { userId: query.userId })
      .getMany();
  }

  async getById(floorId: number) {
    return this.floorRepository
      .createQueryBuilder('floor')
      .innerJoin('floor.restaurant', 'restaurant')
      .addSelect(['restaurant.id', 'restaurant.title'])
      .where('floor.id = :floorId', { floorId })
      .getOne();
  }

  async delete(deleteFloorDto: DeleteFloorRequestDto, currentUserId: number) {
    const floor = await this.getById(deleteFloorDto.id);

    if (!floor) {
      throw new HttpException('Floor does not exist', HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'You are not author of restaurant',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.floorRepository.delete({ id: deleteFloorDto.id });
  }

  async update(updateFloorDto: UpdateFloorRequestDto, currentUserId: number) {
    const floor = await this.getById(updateFloorDto.id);

    if (!floor) {
      throw new HttpException('Floor does not exist', HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'You are not author of restaurant',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(floor, updateFloorDto);

    return this.floorRepository.save(floor);
  }
}
