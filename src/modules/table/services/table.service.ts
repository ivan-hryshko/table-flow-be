import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { TableEntity } from '../table.entity';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { FloorService } from '../../floor/services/floor.service';
import { CreateTableRequestDto } from '../models/dtos/request/create-table.request.dto';
import { UpdateTableRequestDto } from '../models/dtos/request/update-table.request.dto';
import { TableResponseDto } from '../models/dtos/response/table.response.dto';
import { TablesWithCountResponseDto } from '../models/dtos/response/tables-with-count.response.dto';
import { TableQueryParams } from '../models/types/tableQuery.types';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly floorService: FloorService,
  ) {}

  buildTableResponse(table: TableEntity): {
    table: TableResponseDto;
  } {
    return {
      table,
    };
  }

  buildTablesResponse(tables: TableEntity[]): TablesWithCountResponseDto {
    return {
      tables,
      tablesCount: tables.length,
    };
  }

  async create(
    currentUserId: number,
    createTableDto: CreateTableRequestDto,
  ): Promise<TableEntity> {
    const { restaurantId, floorId }: { restaurantId: number; floorId: number } =
      createTableDto;

    await this.restaurantService.validateRestaurantOwnership(
      restaurantId,
      currentUserId,
    );

    await this.floorService.validateFloorForUserAndRestaurant(
      currentUserId,
      restaurantId,
      floorId,
    );

    const newTable: TableEntity = new TableEntity();
    newTable.restaurantId = restaurantId;
    newTable.floorId = floorId;
    newTable.userId = currentUserId;

    Object.assign(newTable, createTableDto);

    return await this.tableRepository.save(newTable);
  }

  async getByUser(query: TableQueryParams) {
    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.floor', 'floor')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .where('user.id = :userId', { userId: query.userId })
      .orderBy('table.createAt', 'DESC')
      .getMany();
  }

  async getById(tableId: number) {
    return await this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.floor', 'floor')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .where('table.id = :tableId', { tableId })
      .getOne();
  }

  async getAllTablesByRestaurantId(
    restaurantId: number,
    //TODO чи треба нам другий параметр ??
    currentUserId: number = 11,
  ): Promise<TableEntity[]> {
    //TODO Додати перевірку неіснуючого "111" та невірного "114aaa" restaurantId

    if (!restaurantId) {
      throw new HttpException(
        `Ресторану з заданим id ${restaurantId} не знайдено`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .orderBy('table.createAt', 'DESC')
      .getMany();
  }

  async delete(currentUserId: number, tableId: number): Promise<void> {
    const errorHelper: ErrorHelper = new ErrorHelper();

    const table: TableEntity = await this.getById(tableId);
    if (!table) {
      errorHelper.addNewError(
        `Столик з заданим id:${tableId} не існує`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (table.userId !== currentUserId) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.tableRepository.delete(tableId);
  }

  async update(updateTableDto: UpdateTableRequestDto, currentUserId: number) {
    const errorHelper = new ErrorHelper();

    const table: TableEntity = await this.getById(updateTableDto.id);
    if (!table) {
      errorHelper.addNewError(
        `Столик з заданим id:${updateTableDto.id} не існує`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (table.userId !== currentUserId) {
      throw new HttpException(
        'Ви не є автором ресторану',
        HttpStatus.FORBIDDEN,
      );
    }

    // TODO перевірити логіку прив'язки ресторану до поверху в новій тасці
    if (updateTableDto.floorId) {
      // Перевірка та отримання поверху перед виконанням оновлення
      const floorToUpdate = await this.floorService.getById(
        updateTableDto.floorId,
      );

      if (!floorToUpdate) {
        errorHelper.addNewError(
          `Поверху з заданим id:${updateTableDto.floorId} не існує`,
          'floor',
        );
        throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
      }

      // Перевірка власника ресторану
      const restaurant = await this.restaurantService.getById(
        floorToUpdate.restaurant.id,
      );

      if (restaurant.user.id !== currentUserId) {
        throw new HttpException(
          'Ви не є автором ресторану',
          HttpStatus.FORBIDDEN,
        );
      }

      // Оновлення поверху столу
      table.floor = floorToUpdate;
    }

    Object.assign(table, updateTableDto);

    return this.tableRepository.save(table);
  }
}
