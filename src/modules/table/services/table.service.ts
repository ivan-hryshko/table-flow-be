import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { FloorService } from '../../floor/services/floor.service';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { CreateTableRequestDto } from '../models/dtos/request/create-table.request.dto';
import { DeleteTableRequestDto } from '../models/dtos/request/delete-table.request.dto';
import { UpdateTableRequestDto } from '../models/dtos/request/update-table.request.dto';
import { TablesWithCountResponseDto } from '../models/dtos/response/tables-with-count.response.dto';
import { TableQueryParams } from '../models/types/tableQuery.types';
import { TableEntity } from '../table.entity';
import { FloorEntity } from '../../floor/floor.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { TableResponseDto } from '../models/dtos/response/table.response.dto';

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

  async create(createTableDto: CreateTableRequestDto): Promise<TableEntity> {
    const errorHelper = new ErrorHelper();

    const restaurant: RestaurantEntity = await this.restaurantService.getById(
      createTableDto.restaurantId,
    );
    if (!restaurant) {
      errorHelper.addNewError(
        `Ресторану з заданим id:${createTableDto.restaurantId} не існує`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const floor: FloorEntity = await this.floorService.getById(
      createTableDto.floorId,
    );
    if (!floor) {
      errorHelper.addNewError(
        `Поверху з заданим id:${createTableDto.floorId} не існує`,
        'floor',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const newTable: TableEntity = new TableEntity();
    newTable.restaurantId = createTableDto.restaurantId;
    newTable.floorId = createTableDto.floorId;
    newTable.userId = restaurant.user.id;

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

  async delete(deleteTableDto: DeleteTableRequestDto, currentUserId: number) {
    const errorHelper = new ErrorHelper();

    const table = await this.getById(deleteTableDto.id);
    if (!table) {
      errorHelper.addNewError(
        `Столик з заданим id:${deleteTableDto.id} не існує`,
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

    return this.tableRepository.delete({ id: deleteTableDto.id });
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
