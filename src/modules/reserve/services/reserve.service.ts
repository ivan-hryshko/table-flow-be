import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReserveEntity } from '../reserve.entity';
import { Repository } from 'typeorm';
import { ReserveResponseInterface } from '../models/types/reserveResponse.interface';
import { CreateReserveRequestDto } from '../models/dtos/request/create-reserve.request.dto';
import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { TableService } from '../../table/services/table.service';
import { ReservesResponseInterface } from '../models/types/reservesResponse.interface';
import { TableEntity } from '../../table/table.entity';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly reserveRepository: Repository<ReserveEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly tableService: TableService,
  ) {}

  buildReserveResponse(reserve: ReserveEntity): ReserveResponseInterface {
    return { reserve };
  }
  buildReservesResponse(reserves: ReserveEntity[]): ReservesResponseInterface {
    return {
      reserves,
      reservesCount: reserves.length,
    };
  }

  async create(
    createReserveDto: CreateReserveRequestDto,
  ): Promise<ReserveEntity> {
    const errorHelper = new ErrorHelper();
    const restaurant = await this.restaurantService.getById(
      createReserveDto.restaurantId,
    );
    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторан з заданим id:${createReserveDto.restaurantId} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    function getRandomTable(tables: TableEntity[]): TableEntity {
      if (!tables.length) {
        const errorHelper = new ErrorHelper();
        errorHelper.addNewError(`Столик не існує`, 'table');
        throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
      }
      const randomIndex = Math.floor(Math.random() * tables.length);
      return tables[randomIndex];
    }

    const allTablesByRestaurant =
      await this.tableService.getAllTablesByRestaurantId(restaurant.id);

    const randomTable = getRandomTable(allTablesByRestaurant);
    if (!randomTable) {
      errorHelper.addNewError(`Нема доступних столиків`, 'table');
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const newReserve = new ReserveEntity();
    Object.assign(newReserve, createReserveDto, randomTable);
    newReserve.tableId = randomTable?.id; // Set the tableId property

    // Convert 'reserveStartTime' string to Date
    newReserve.reserveStartTime = new Date(
      `${createReserveDto.reserveDate}T${createReserveDto.reserveStartTime}`,
    );

    return await this.reserveRepository.save(newReserve);
  }
}
