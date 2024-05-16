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
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { UploadService } from '../../upload/upload.service';
import { FloorEntity } from '../floor.entity';
import { CreateFloorRequestDto } from '../models/dtos/request/create-floor.request.dto';
import { UpdateFloorRequestDto } from '../models/dtos/request/update-floor.request.dto';
import { FloorResponseDto } from '../models/dtos/response/floor.response.dto';
import { FloorsResponseDto } from '../models/dtos/response/floors.response.dto';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private readonly floorRepository: Repository<FloorEntity>,
    private readonly uploadService: UploadService,
    @Inject(forwardRef(() => RestaurantService))
    private readonly restaurantService: RestaurantService,
  ) {}

  buildFloorResponse(floor: any): { floor: any } {
    return {
      floor,
    };
  }

  buildFloorsResponse(floors: any[]): FloorsResponseDto {
    return {
      floors,
      floorsCount: floors.length,
    };
  }

  async create(
    currentUserId: number,
    createFloorDto: CreateFloorRequestDto,
  ): Promise<FloorEntity> {
    const restaurant = await this.restaurantService.getById(
      createFloorDto.restaurantId,
    );

    if (!restaurant) {
      throw new HttpException('Ресторан не існує', HttpStatus.NOT_FOUND);
    }

    if (restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    const newFloor = new FloorEntity();
    newFloor.title = createFloorDto.title;
    newFloor.restaurantId = createFloorDto.restaurantId;

    return await this.floorRepository.save(newFloor);
  }

  async getByUser(userId: number): Promise<FloorEntity[]> {
    return await this.floorRepository
      .createQueryBuilder('floor')
      .innerJoinAndSelect('floor.restaurant', 'restaurant')
      .innerJoinAndSelect('restaurant.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async getById(floorId: number): Promise<FloorEntity> {
    return this.floorRepository
      .createQueryBuilder('floor')
      .innerJoinAndSelect('floor.restaurant', 'restaurant')
      .innerJoinAndSelect('restaurant.user', 'user')
      .addSelect(['restaurant.id', 'restaurant.title'])
      .where('floor.id = :floorId', { floorId })
      .getOne();
  }

  async delete(currentUserId: number, floorId: number): Promise<void> {
    const floor = await this.getById(floorId);

    if (!floor) {
      throw new HttpException('Поверху не існує', HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    this.floorRepository.delete(floorId);
  }

  async update(
    updateFloorDto: UpdateFloorRequestDto,
    currentUserId: number,
  ): Promise<FloorEntity> {
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

  async validateFloorForUserAndRestaurant(
    currentUserId: number,
    restaurantId: number,
    floorId: number,
  ): Promise<FloorEntity> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const floor: FloorEntity = await this.getById(floorId);

    if (!floor) {
      errorHelper.addNewError(
        `Поверх з заданим id:${floorId} не існує`,
        'floor',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const restaurant: RestaurantEntity =
      await this.restaurantService.getById(restaurantId);
    if (restaurant.user.id !== currentUserId) {
      errorHelper.addNewError(
        `Ви не можете додати стіл, оскільки ресторан з вказаним id:${restaurantId} не належить поточному юзеру.`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.id !== restaurantId) {
      errorHelper.addNewError(
        `Ви не можете додати стіл, оскільки поверх з вказаним id:${floorId} не належить до ресторану з id:${restaurantId}.`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return floor;
  }

  async updateImage(
    id: number,
    file: Express.Multer.File,
    currentUserId: number,
  ): Promise<FloorResponseDto> {
    const floor = await this.getById(id);

    if (!floor) {
      throw new HttpException('Поверх не існує', HttpStatus.NOT_FOUND);
    }

    if (floor.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'Ви не є власником ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    const uploadedFile = await this.uploadService.uploadFile({
      file,
      directory: 'floorImages',
    });

    floor.imgKey = uploadedFile.Key;

    const imgSrcExpiresIn = 60;

    const imgSrc = await this.uploadService.getSignedUrl(
      uploadedFile.Key,
      imgSrcExpiresIn,
    );

    const savedFloor = await this.floorRepository.save(floor);

    return {
      ...savedFloor,
      imgSrc,
    };
  }
}
