import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReserveEntity } from '../reserve.entity';
import { CreateReserveRequestDto } from '../models/dtos/request/create-reserve.request.dto';
import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { TableService } from '../../table/services/table.service';
import { ReservesResponseInterface } from '../models/types/reservesResponse.interface';
import { TableEntity } from '../../table/table.entity';
import { ReserveResponseDto } from '../models/dtos/response/reserve.response.dto';
import { DeleteReserveRequestDto } from '../models/dtos/request/delete-reserve.request.dto';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly reserveRepository: Repository<ReserveEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly tableService: TableService,
  ) {}

  buildReserveResponse(reserve: ReserveEntity): {
    reserve: ReserveResponseDto;
  } {
    return {
      reserve,
    };
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
    const errorHelper: ErrorHelper = new ErrorHelper();
    const {
      reserveDate,
      reserveStartTime,
      reserveDurationTime,
      restaurantId,
      countOfGuests,
    }: {
      reserveDate: Date;
      reserveStartTime: Date;
      reserveDurationTime: number;
      restaurantId: number;
      countOfGuests: number;
    } = createReserveDto;

    const restaurant = await this.restaurantService.getById(restaurantId);
    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторан з заданим id:${restaurantId} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const allTablesByRestaurant: TableEntity[] =
      await this.tableService.getAllTablesByRestaurantId(restaurant.id);

    // 1 // Перевірка кількості г
    // остей
    const isGuestCountValid = (table: TableEntity): boolean =>
      countOfGuests <= table.seatsCount;

    // 2 // Перевірка часу резерву
    //TODO переписати дати використовуючи лібу moment.js
    const reserveStartDateTime: Date = new Date(
      `${reserveDate}T${reserveStartTime}`,
    );
    const reserveEndDateTime: Date = new Date(reserveStartDateTime);
    reserveEndDateTime.setHours(
      reserveEndDateTime.getHours() + reserveDurationTime,
    );

    const isReservationTimeValid = (table: TableEntity) => {
      const openingRestaurantDateTime: Date = new Date(
        reserveStartDateTime.toISOString().split('T')[0] +
          'T' +
          restaurant.openingTime,
      );

      const isStartTimeValid: boolean =
        reserveStartDateTime >= openingRestaurantDateTime;

      const closingRestaurantDateTime: Date = new Date(
        reserveStartDateTime.toISOString().split('T')[0] +
          'T' +
          restaurant.closingTime,
      );
      const isEndTimeValid: boolean =
        reserveEndDateTime <= closingRestaurantDateTime;

      return isStartTimeValid && isEndTimeValid;
    };

    // 3 // Перевірка наявності інших бронювань на той же час
    const isNoOverlapReservations = async (
      table: TableEntity,
    ): Promise<boolean> => {
      const reservations: ReserveEntity[] = await this.reserveRepository.find({
        where: { tableId: table.id },
      });

      const isValid: boolean = !reservations.some(
        (reservation: ReserveEntity) => {
          const existingStart: Date = new Date(reservation.reserveStartTime);
          const existingEnd: Date = new Date(existingStart);
          existingEnd.setHours(
            existingEnd.getHours() + reservation.reserveDurationTime,
          );

          return (
            (reserveStartDateTime >= existingStart &&
              reserveStartDateTime < existingEnd) ||
            (reserveEndDateTime > existingStart &&
              reserveEndDateTime <= existingEnd)
          );
        },
      );

      console.log('isNoOverlapReservations >>>>', isValid);
      return isValid;
    };

    // Перевірка кожного столу
    const checkTableConditions = async (table: TableEntity) => {
      const isGuestCountValidResult: boolean = await isGuestCountValid(table);
      const isReservationTimeValidResult: boolean =
        await isReservationTimeValid(table);
      const isNoOverlapReservationsResult: boolean =
        await isNoOverlapReservations(table);

      return (
        isGuestCountValidResult &&
        isReservationTimeValidResult &&
        isNoOverlapReservationsResult
      );
    };

    const availableTables: TableEntity[] = [];
    for (const table of allTablesByRestaurant) {
      const isValid: boolean = await checkTableConditions(table);

      if (isValid) availableTables.push(table);
    }

    if (availableTables.length === 0) {
      errorHelper.addNewError(
        `На цей час або дату немає доступних столів`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    // Обираємо перший стіл з наіменшою кількістю посадкових місць
    const selectedTable: TableEntity = availableTables.sort(
      (a: TableEntity, b: TableEntity) => a.seatsCount - b.seatsCount,
    )[0];

    const newReserve: ReserveEntity = new ReserveEntity();
    Object.assign(newReserve, createReserveDto);

    newReserve.tableId = selectedTable?.id; // Set the tableId property
    newReserve.reserveStartTime = new Date(
      `${reserveDate}T${reserveStartTime}`,
    ); // Convert 'reserveStartTime' string to Date

    return await this.reserveRepository.save(newReserve);
  }

  async getRepositoryById(reserveId: number): Promise<ReserveEntity | null> {
    return this.reserveRepository
      .createQueryBuilder('reserve')
      .leftJoin('reserve.table', 'table')
      .leftJoin('table.floor', 'floor')
      .leftJoin('table.restaurant', 'restaurant')
      .leftJoin('restaurant.user', 'user')
      .where('reserve.id = :reserveId', { reserveId })
      .getOne();
  }

  async getById(
    currentUserId: number,
    reserveId: number,
  ): Promise<ReserveEntity> {
    const errorHelper = new ErrorHelper();

    const reserve = await this.getRepositoryById(reserveId);

    if (!reserve) {
      const errorHelper: ErrorHelper = new ErrorHelper();
      errorHelper.addNewError(
        `Резерву з заданим id:${reserveId} не існує`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return reserve;
  }

  async delete(currentUserId: number, reserveId: number) {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const reserve: ReserveEntity = await this.getById(currentUserId, reserveId);
    if (!reserve) {
      errorHelper.addNewError(
        `Резерву з заданим id:${reserveId} не існує`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const restaurant: RestaurantEntity = await this.restaurantService.getById(
      reserve.restaurantId,
    );

    const isCurrentUserOwner = currentUserId === restaurant.user.id;
    if (!isCurrentUserOwner) {
      errorHelper.addNewError(
        `Ви не можете видалити резерв, бо ви не власник ресторану`,
        'owner',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.FORBIDDEN);
    }

    return this.reserveRepository.delete(reserveId);
  }
}
