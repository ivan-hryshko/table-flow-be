import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FloorEntity } from "./floor.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFloorDto } from "./dto/createFloor.dto";
import { UserEntity } from "@app/user/user.entity";
import { FloorResponseInterface } from "./types/floorResponse.interface";
import { FloorQueryParams } from "./types/floorQuery.types";
import { FloorsResponseInterface } from "./types/floorsResponse.interface";
import { DeleteFloorDto } from "./dto/deleteFloor.dto";
import { UpdateFloorDto } from "./dto/updateFloor.dto";
import { RestaurantService } from "@app/restaurant/restaurant.service";

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private readonly floorRepository:
    Repository<FloorEntity>,
    private readonly restaurantService: RestaurantService
  ) {}

  buildFloorResponse(floor: FloorEntity): FloorResponseInterface {
    return {
      floor
    }
  }

  buildFloorsResponse(floors: FloorEntity[]): FloorsResponseInterface {
    return {
      floors,
      floorsCount: floors.length,
    }
  }

  async create(currentUser: UserEntity, createFloorDto: CreateFloorDto): Promise<FloorEntity> {
    const newFloor = new FloorEntity()
    newFloor.title = createFloorDto.title
    const restaurant = await this.restaurantService.getById(createFloorDto.restaurantId)

    if (!restaurant) {
      throw new HttpException('Restaurant does not exist', HttpStatus.NOT_FOUND)
    }

    if (restaurant.user.id !== currentUser.id) {
      throw new HttpException('You are not author of restaurant', HttpStatus.FORBIDDEN)
    }
    newFloor.restaurant = restaurant
    return await this.floorRepository.save(newFloor)
  }

  async getByUser(query: FloorQueryParams) {
    return this.floorRepository
      .createQueryBuilder("floor")
      .innerJoin("floor.user", "user")
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .where('user.id = :userId', { userId: query.userId })
      .getMany()
  }

  async getById(floorId: number) {
    return this.floorRepository.findOne({ id: floorId})
  }

  async delete(deleteFloorDto: DeleteFloorDto, currentUserId: number) {
    const floor = await this.getById(deleteFloorDto.id)

    if (!floor) {
      throw new HttpException('Floor does not exist', HttpStatus.NOT_FOUND)
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException('You are not author of restaurant', HttpStatus.FORBIDDEN)
    }

    return this.floorRepository.delete({ id: deleteFloorDto.id })
  }

  async update(updateFloorDto: UpdateFloorDto, currentUserId: number) {
    const floor = await this.getById(updateFloorDto.id)

    if (!floor) {
      throw new HttpException('Floor does not exist', HttpStatus.NOT_FOUND)
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException('You are not author of restaurant', HttpStatus.FORBIDDEN)
    }

    Object.assign(floor, updateFloorDto)

    return this.floorRepository.save(floor)
  }
}
