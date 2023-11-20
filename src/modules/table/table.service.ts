import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorHelper } from '../../utils/errors/errorshelper.helper';
import { FloorService } from '../floor/services/floor.service';
import { RestaurantService } from '../restaurant/services/restaurant.service';
import { CreateTableRequestDto } from './model/dtos/request/create-table.request.dto';
import { TableQueryParams } from './model/types/tableQuery.types';
import { TableResponseInterface } from './model/types/tableResponse.interface';
import { TablesResponseInterface } from './model/types/tablesResponse.interface';
import { TableEntity } from './table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly floorService: FloorService,
  ) {}

  buildTableResponse(table: TableEntity): TableResponseInterface {
    return {
      table,
    };
  }

  buildTablesResponse(tables: TableEntity[]): TablesResponseInterface {
    return {
      tables,
      tablesCount: tables.length,
    };
  }

  async create(createTableDto: CreateTableRequestDto): Promise<TableEntity> {
    const errorHelper = new ErrorHelper();
    const restaurant = await this.restaurantService.getById(
      createTableDto.restaurantId,
    );
    if (!restaurant) {
      errorHelper.addNewError(
        `Restaurant with given id:${createTableDto.restaurantId} does not exist`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const floor = await this.floorService.getById(createTableDto.floorId);
    if (!floor) {
      errorHelper.addNewError(
        `Floor with given id:${createTableDto.floorId} does not exist`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const newTable = new TableEntity();
    Object.assign(newTable, createTableDto);
    newTable.restaurant = restaurant;
    return await this.tableRepository.save(newTable);
  }

  async getByUser(query: TableQueryParams) {
    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoinAndSelect('table.user', 'user')
      .innerJoinAndSelect('table.floor', 'floor')
      .where('user.id = :userId', { userId: query.userId })
      .getMany();
  }

  async deleteByUser(query: TableQueryParams) {
    return this.tableRepository
      .createQueryBuilder() //Створення нового об'єкта QueryBuilder для виконання SQL-запитів.
      .delete() //Вказуємо, що це буде операція DELETE.
      .from(TableEntity) //Визначення таблиці, з якої видаляємо дані. TableEntity - це клас сутності, який представляє таблицю "table" в базі даних.
      .where('user.id = :userId', { userId: query.userId }) //Умова видалення → для рядків, де значення стовпця "user.id" дорівнює query.userId.
      .execute(); //Запуск SQL-запиту на виконання. В даному випадку, це виконає видалення рядків у вказаних умовах.
  }
}
