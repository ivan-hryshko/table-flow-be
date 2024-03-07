import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReserveEntity } from '../reserve.entity';
import { CreateReserveRequestDto } from '../models/dtos/request/create-reserve.request.dto';
import { UpdateReserveRequestDto } from '../models/dtos/request/update-reserve.request.dto';
import { ReserveResponseDto } from '../models/dtos/response/reserve.response.dto';
import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { TableService } from '../../table/services/table.service';
import { TableEntity } from '../../table/table.entity';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly reserveRepository: Repository<ReserveEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly tableService: TableService,
  ) {}

  buildReserveResponse = (
    reserve: ReserveEntity,
  ): { reserve: ReserveResponseDto } => ({ reserve });

  async create(
    currentUserId: number,
    createReserveDto: CreateReserveRequestDto,
  ): Promise<ReserveEntity> {
    const errorHelper: ErrorHelper = new ErrorHelper();
    const { reserveDate, reserveStartTime, restaurantId } = createReserveDto;

    const restaurant: RestaurantEntity =
      await this.restaurantService.getById(restaurantId);
    await this.restaurantService.validateRestaurantOwnership(
      currentUserId,
      restaurantId,
    );

    const allTablesByRestaurant: TableEntity[] =
      await this.tableService.getAllTablesByRestaurantId(
        currentUserId,
        restaurant.id,
      );

    const availableTables: TableEntity[] = [];

    for (const table of allTablesByRestaurant) {
      const isAvailableTables: boolean = await this.checkTableConditions(
        createReserveDto,
        restaurant,
        table,
      );

      if (isAvailableTables) availableTables.push(table);
    }

    if (availableTables.length === 0) {
      errorHelper.addNewError(
        `На жаль, всі столики на вказану дату ${reserveDate} або час ${reserveStartTime} вже зайняті. Будь ласка, оберіть інший час або дату для вашої резервації.`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const selectedTableWithMinSeat: TableEntity = availableTables.sort(
      (a: TableEntity, b: TableEntity) => a.seatsCount - b.seatsCount,
    )[0];

    const newReserve: ReserveEntity = new ReserveEntity();
    Object.assign(newReserve, createReserveDto);

    newReserve.tableId = selectedTableWithMinSeat?.id; // Set the tableId property
    newReserve.reserveStartTime = new Date(
      `${reserveDate}T${reserveStartTime}`,
    ); // Convert 'reserveStartTime' string to Date

    return await this.reserveRepository.save(newReserve);
  }

  async getById(
    currentUserId: number,
    reserveId: number,
  ): Promise<ReserveEntity> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const reserve: ReserveEntity = await this.reserveRepository
      .createQueryBuilder('reserve')
      .leftJoin('reserve.table', 'table')
      .leftJoin('table.floor', 'floor')
      .leftJoin('table.restaurant', 'restaurant')
      .leftJoin('restaurant.user', 'user')
      .where('reserve.id = :reserveId', { reserveId })
      .getOne();

    if (!reserve) {
      errorHelper.addNewError(
        `Резерву з заданим id:${reserveId} не існує`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    await this.restaurantService.validateRestaurantOwnership(
      currentUserId,
      reserve.restaurantId,
    );

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
    await this.restaurantService.validateRestaurantOwnership(
      currentUserId,
      restaurant.id,
    );

    return this.reserveRepository.delete(reserveId);
  }

  async update(
    currentUserId: number,
    updateReserveDto: UpdateReserveRequestDto,
  ): Promise<ReserveEntity> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const reserve: ReserveEntity = await this.getById(
      currentUserId,
      updateReserveDto.id,
    );

    if (!reserve)
      throw new HttpException('Резерв не існує', HttpStatus.NOT_FOUND);

    const table: TableEntity = await this.tableService.getById(
      currentUserId,
      reserve.tableId,
    );
    if (table.userId !== currentUserId) {
      errorHelper.addNewError(
        `Ви не можете змінити резерв, оскільки ви не власник ресторану`,
        'reserve',
      );
    }

    Object.assign(reserve, updateReserveDto);

    return this.reserveRepository.save(reserve);
  }

  // 1 // Перевірка кількості гостей
  async isGuestCountValid(
    createReserveDto: CreateReserveRequestDto,
    table: TableEntity,
  ): Promise<boolean> {
    const errorHelper: ErrorHelper = new ErrorHelper();
    const { countOfGuests } = createReserveDto;

    const isGuestCountValid: boolean = countOfGuests <= table.seatsCount;

    if (!isGuestCountValid) {
      errorHelper.addNewError(
        `Ваш резерв на ${countOfGuests} місць не може бути виконаний. Кількість посадочних місць за жодним столом недостатня. Будь ласка, розгляньте можливість розподілити резерв на декілька менших замовлень.`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return isGuestCountValid;
  }

  // 2 // Перевірка Дня резерву
  async isReservationDayValid(
    createReserveDto: CreateReserveRequestDto,
  ): Promise<boolean> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const reserveDate: Date = new Date(createReserveDto.reserveDate);
    const currentDay: Date = new Date();
    currentDay.setUTCHours(0, 0, 0, 0);
    const currentDateZeroTime: Date = new Date(currentDay);

    const isDayValid: boolean = reserveDate >= currentDateZeroTime;

    if (!isDayValid) {
      errorHelper.addNewError(
        `Обраний день резерву ${reserveDate.toLocaleDateString()} меньше, ніж поточний день ${currentDay.toLocaleDateString()}. Будь ласка, виберіть ішний день.`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return isDayValid;
  }

  // 3 // Перевірка Часу резерву
  async isReservationTimeValid(
    createReserveDto: CreateReserveRequestDto,
    restaurant: RestaurantEntity,
  ): Promise<boolean> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const { reserveDate, reserveStartTime, reserveDurationTime } =
      createReserveDto;

    const reserveStartDateTime: Date = new Date(
      `${reserveDate}T${reserveStartTime}`,
    );
    const reserveEndDateTime: Date = new Date(reserveStartDateTime);
    reserveEndDateTime.setHours(
      reserveEndDateTime.getHours() + reserveDurationTime,
    );

    const openingRestaurantDateTime: Date = new Date(
      reserveStartDateTime.toISOString().split('T')[0] +
        'T' +
        restaurant.openingTime,
    );

    const isStartTimeValid: boolean =
      reserveStartDateTime >= openingRestaurantDateTime;
    if (!isStartTimeValid) {
      const formattedReserveTime: string =
        reserveStartDateTime.toLocaleTimeString();
      const formattedOpeningTime: string =
        openingRestaurantDateTime.toLocaleTimeString();

      errorHelper.addNewError(
        `Обраний час резерву ${formattedReserveTime} не може бути раніше, ніж час відкриття ресторану ${formattedOpeningTime}. Будь ласка, виберіть інший час.`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return isStartTimeValid;
  }

  // 4 // Перевірка часу закінчення резерву до часу закриття ресторану
  async isEndTimeValid(
    createReserveDto: CreateReserveRequestDto,
    restaurant: RestaurantEntity,
  ): Promise<boolean> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const { reserveDate, reserveStartTime, reserveDurationTime } =
      createReserveDto;

    const reserveStartDateTime: Date = new Date(
      `${reserveDate}T${reserveStartTime}`,
    );

    const closingRestaurantDateTime: Date = new Date(
      reserveStartDateTime.toISOString().split('T')[0] +
        'T' +
        restaurant.closingTime,
    );
    const reserveEndDateTime: Date = new Date(reserveStartDateTime);
    reserveEndDateTime.setHours(
      reserveEndDateTime.getHours() + reserveDurationTime,
    );

    const isEndTimeValid: boolean =
      reserveEndDateTime <= closingRestaurantDateTime;
    if (!isEndTimeValid) {
      errorHelper.addNewError(
        `Час завершення резерву (${reserveEndDateTime.toLocaleString()}) перевищує час закриття ресторану (${closingRestaurantDateTime.toLocaleString()}). Будь ласка, виберіть інший час для завершення свого резерву.`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return isEndTimeValid;
  }

  // 5 // Перевірка наявності інших бронювань на той же час
  async isNoOverlapReservations(
    createReserveDto: CreateReserveRequestDto,
    table: TableEntity,
  ): Promise<boolean> {
    const { reserveDate, reserveStartTime, reserveDurationTime } =
      createReserveDto;

    const reserveStartDateTime: Date = new Date(
      `${reserveDate}T${reserveStartTime}`,
    );
    const reserveEndDateTime: Date = new Date(reserveStartDateTime);
    reserveEndDateTime.setHours(
      reserveEndDateTime.getHours() + reserveDurationTime,
    );

    const reservations: ReserveEntity[] = await this.reserveRepository.find({
      where: { tableId: table.id },
    });

    const isNoOverlap: boolean = !reservations.some(
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

    return isNoOverlap;
  }

  // 1+2+3+4+5 // Перевірка кожного столу за всіма умовами
  async checkTableConditions(
    createReserveDto: CreateReserveRequestDto,
    restaurant: RestaurantEntity,
    table: TableEntity,
  ): Promise<boolean> {
    const validations = await Promise.all([
      this.isGuestCountValid(createReserveDto, table),
      this.isReservationDayValid(createReserveDto),
      this.isReservationTimeValid(createReserveDto, restaurant),
      this.isEndTimeValid(createReserveDto, restaurant),
      this.isNoOverlapReservations(createReserveDto, table),
    ]);

    return validations.every((result) => result);
  }
}
