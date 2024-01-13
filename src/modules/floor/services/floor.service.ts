import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { UserEntity } from '../../user/user.entity';
import { FloorEntity } from '../floor.entity';
import { CreateFloorRequestDto } from '../models/dtos/request/create-floor.request.dto';
import { DeleteFloorRequestDto } from '../models/dtos/request/delete-floor.request.dto';
import { UpdateFloorRequestDto } from '../models/dtos/request/update-floor.request.dto';
import { CreateFloorResponseDto } from '../models/dtos/response/create-floor.response.dto';
import { FloorResponseDto } from '../models/dtos/response/floor.response.dto';
import { FloorsResponseDto } from '../models/dtos/response/floors.response.dto';
import { UpdateFloorResponseDto } from '../models/dtos/response/update-floor.response.dto';
import { FloorQueryParams } from '../models/types/floorQuery.types';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private readonly floorRepository: Repository<FloorEntity>,
    private readonly restaurantService: RestaurantService,
  ) {}

  buildFloorResponse(floor: FloorEntity): { floor: FloorEntity } {
    return {
      floor,
    };
  }

  buildFloorsResponse(floors: FloorEntity[]): FloorsResponseDto {
    return {
      floors,
      floorsCount: floors.length,
    };
  }

  async create(
    currentUser: UserEntity,
    createFloorDto: CreateFloorRequestDto,
  ): Promise<CreateFloorResponseDto> {
    const restaurant = await this.restaurantService.getById(
      createFloorDto.restaurantId,
    );

    if (!restaurant) {
      throw new HttpException(
        'Ресторан не існує',
        HttpStatus.NOT_FOUND,
      );
    }

    if (restaurant.user.id !== currentUser.id) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    const newFloor = new FloorEntity();
    newFloor.title = createFloorDto.title;
    newFloor.restaurant = restaurant;
    return await this.floorRepository.save(newFloor);
  }

  async getByUser(query: FloorQueryParams): Promise<FloorResponseDto[]> {
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
      throw new HttpException('Поверху не існує', HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.floorRepository.delete({ id: deleteFloorDto.id });
  }

  async update(
    updateFloorDto: UpdateFloorRequestDto,
    currentUserId: number,
  ): Promise<UpdateFloorResponseDto> {
    const floor = await this.getById(updateFloorDto.id);

    if (!floor) {
      throw new HttpException('Поверху не існує', HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(floor, updateFloorDto);

    return this.floorRepository.save(floor);
  }
}
