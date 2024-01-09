import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReserveEntity } from '../reserve.entity';
import { getConnection, LessThan, MoreThan, Repository } from 'typeorm';
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
    const {
      reserveDate,
      reserveStartTime,
      reserveDurationTime,
      restaurantId,
      countOfGuests,
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

    // 1 // Перевірка кількості гостей
    const isGuestCountValid = (table: TableEntity) =>
      countOfGuests <= table.seatsCount;

    // 2 // Перевірка часу резерву

    const reserveStartDateTime = new Date(`${reserveDate}T${reserveStartTime}`);
    const reserveEndDateTime = new Date(reserveStartDateTime);
    reserveEndDateTime.setHours(
      reserveEndDateTime.getHours() + reserveDurationTime,
    );

    const isReservationTimeValid = (table: TableEntity) => {
      const openingRestaurantDateTime = new Date(
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
    const isNoOverlapReservations = async (table: TableEntity) => {
      const reservations = await this.reserveRepository.find({
        where: { tableId: table.id },
      });

      const isValid = !reservations.some((reservation) => {
        const existingStart = new Date(reservation.reserveStartTime);
        const existingEnd = new Date(existingStart);
        existingEnd.setHours(
          existingEnd.getHours() + reservation.reserveDurationTime,
        );

        return (
          (reserveStartDateTime >= existingStart &&
            reserveStartDateTime < existingEnd) ||
          (reserveEndDateTime > existingStart &&
            reserveEndDateTime <= existingEnd)
        );
      });

      console.log('isNoOverlapReservations >>>>', isValid);
      return isValid;
    };

    // Перевірка кожного столу
    const checkTableConditions = async (table: TableEntity) => {
      const isGuestCountValidResult = isGuestCountValid(table);
      const isReservationTimeValidResult = isReservationTimeValid(table);
      const isNoOverlapReservationsResult = isNoOverlapReservations(table);

      return Promise.all([
        isGuestCountValidResult,
        isReservationTimeValidResult,
        isNoOverlapReservationsResult,
      ]).then(([guestCountValid, reservationTimeValid, noOverlapValid]) => {
        return guestCountValid && reservationTimeValid && noOverlapValid;
      });
    };

    const availableTables = await Promise.all(
      allTablesByRestaurant.map(async (table) => ({
        table,
        isValid: await checkTableConditions(table),
      })),
    );

    const filteredTables = availableTables
      .filter(({ isValid }) => isValid)
      .map(({ table }) => table);

    if (filteredTables.length === 0) {
      errorHelper.addNewError(`Немає доступних столів`, 'table');
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    // Обираємо перший доступний стіл
    const selectedTable = filteredTables[0];

    const newReserve = new ReserveEntity();
    Object.assign(newReserve, createReserveDto, selectedTable);

    newReserve.tableId = selectedTable?.id; // Set the tableId property
    newReserve.reserveStartTime = new Date(
      `${reserveDate}T${reserveStartTime}`,
    ); // Convert 'reserveStartTime' string to Date

    // Додавання нового  бронювання
    const createdReserve = await this.reserveRepository.save(newReserve);

    /*
    // Видаляємо інші бронювання на той же час для вибраного столу
    reservations = reservations.filter(
      (reservation) =>
        reservation.tableId !== selectedTable?.id ||
        reservation.id === createdReserve.id,
    );
        */

    return createdReserve;
  }
}
