import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReserveEntity } from '../reserve.entity';
import { Repository } from 'typeorm';
import { ReserveResponseInterface } from '../models/types/reserveResponse.interface';
import { CreateReserveRequestDto } from '../models/dtos/request/create-reserve.request.dto';
import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
// import { FloorService } from '../../floor/services/floor.service';
// import { TableService } from '../../table/services/table.service';
import { ReservesResponseInterface } from '../models/types/reservesResponse.interface';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly reserveRepository: Repository<ReserveEntity>,
    private readonly restaurantService: RestaurantService,
    // private readonly floorService: FloorService,
    // private readonly tableService: TableService,
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
      createReserveDto.restaurantId
    )
    if (!restaurant) {
      errorHelper.addNewError(
        `Restaurant with given id:${createReserveDto.restaurantId} does not exist`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    // const floor = await this.floorService.getById(createReserveDto.floorId);
    // if (!floor) {
    //   errorHelper.addNewError(
    //     `Floor with given id:${createReserveDto.floorId} does not exist`,
    //     'floor',
    //   );
    //   throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    // }

    // const table = await this.tableService.getById(createReserveDto.tableId);
    // if (!table) {
    //   errorHelper.addNewError(
    //     `Table with given id:${createReserveDto.tableId} does not exist`,
    //     'table',
    //   );
    //   throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    // }

    const newReserve = new ReserveEntity();
    Object.assign(newReserve, createReserveDto);
    newReserve.restaurant = restaurant;
    return await this.reserveRepository.save(newReserve);
  }
}
