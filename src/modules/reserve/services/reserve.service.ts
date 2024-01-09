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

    const allTablesByRestaurant: TableEntity[] =
      await this.tableService.getAllTablesByRestaurantId(restaurant.id);

    // Функція для перевірки кількості гостей
    const isGuestCountValid = (table: TableEntity) => {
      console.log('Checking guest count for table with id:', table.id);
      const isValid: boolean =
        createReserveDto.countOfGuests <= table.seatsCount;
      console.log('Result isGuestCountValid >>>>', isValid);
      return isValid;
    };

    const reserveStartDateTime: Date = new Date(
      `${createReserveDto.reserveDate}T${createReserveDto.reserveStartTime}`,
    );
    const reserveEndDateTime: Date = new Date(reserveStartDateTime);
    reserveEndDateTime.setHours(
      reserveEndDateTime.getHours() + createReserveDto.reserveDurationTime,
    );

    // Функція для перевірки часу резерву
    const isReservationTimeValid = (table: TableEntity) => {
      console.log('Checking reservation time for table with id:', table.id);
      // const reserveStartDateTime: Date = new Date(
      //   `${createReserveDto.reserveDate}T${createReserveDto.reserveStartTime}`,
      // );
      // const reserveEndDateTime: Date = new Date(reserveStartDateTime);
      // reserveEndDateTime.setHours(
      //   reserveEndDateTime.getHours() + createReserveDto.reserveDurationTime,
      // );

      const currentDateTime: Date = new Date();

      // Перевірка часу початку резерву
      const openingTime: '14:00' = '14:00';
      const openingTimeDate: Date = new Date(
        currentDateTime.getFullYear(),
        currentDateTime.getMonth(),
        currentDateTime.getDate(),
        Number(openingTime.split(':')[0]),
        Number(openingTime.split(':')[1]),
      );
      const isStartTimeValid: boolean = reserveStartDateTime >= openingTimeDate;
      console.log('isStartTimeValid >>>>', isStartTimeValid);
      //TODO додати в Entity час відкриття ресторану. Після – прибрати тимчасову логіку часу початку
      // const isStartTimeValid = reserveStartDateTime >= restaurant.openingTime;

      // Перевірка часу закінчення резерву
      const closingTime: '24:00' = '24:00';
      const closingTimeDate: Date = new Date(
        reserveEndDateTime.getFullYear(),
        reserveEndDateTime.getMonth(),
        reserveEndDateTime.getDate(),
        Number(closingTime.split(':')[0]),
        Number(closingTime.split(':')[1]),
      );
      const isEndTimeValid: boolean = reserveEndDateTime <= closingTimeDate;
      console.log('isEndTimeValid >>>>', isEndTimeValid);
      console.log('reserveEndDateTime >>>>', reserveEndDateTime);
      console.log('closingTimeDate >>>>', closingTimeDate);
      //TODO додати в Entity час закриття ресторану. Після – прибрати тимчасову логіку часу закриття
      // const isEndTimeValid = reserveEndDateTime <= restaurant.closingTime;

      const isValid: boolean = isStartTimeValid && isEndTimeValid;
      console.log('Result isReservationTimeValid >>>>', isValid);
      return isValid;
    };

    // Функція для перевірки наявності інших бронювань на той же час
    const isNoOverlapReservations = async (table: TableEntity) => {
      const reservations = await this.reserveRepository.find({
        where: { tableId: table.id },
      });
      console.log('reservations >>>>', reservations);

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
      console.log('Result isNoOverlapReservations >>>>', isValid);
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

    console.log('filteredTables >>>>', filteredTables);

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
      `${createReserveDto.reserveDate}T${createReserveDto.reserveStartTime}`,
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
