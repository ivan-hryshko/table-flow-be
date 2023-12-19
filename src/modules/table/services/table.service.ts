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

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly floorService: FloorService,
  ) {}

  buildTableResponse(table: TableEntity): { table: TableEntity } {
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
        'floor',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    const newTable = new TableEntity();
    Object.assign(newTable, createTableDto);
    newTable.restaurant = restaurant;
    newTable.floor = floor;
    return await this.tableRepository.save(newTable);
  }

  async getByUser(query: TableQueryParams) {
    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.floor', 'floor')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .where('user.id = :userId', { userId: query.userId })
      .getMany();
  }

  async getById(tableId: number) {
    return await this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.floor', 'floor')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .addSelect(['user.id', 'user.firstName', 'user.lastName'])
      .addSelect(['restaurant.id', 'restaurant.title'])
      .addSelect(['floor.id', 'floor.title'])
      .where('table.id = :tableId', { tableId })
      .getOne();
  }

  async delete(deleteTableDto: DeleteTableRequestDto, currentUserId: number) {
    const errorHelper = new ErrorHelper();
    const table = await this.getById(deleteTableDto.id);

    if (!table) {
      errorHelper.addNewError(
        `Table with given id:${deleteTableDto.id} does not exist`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (table.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'You are not author of restaurant',
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
        `Table with given id:${updateTableDto.id} does not exist`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    if (table.restaurant.user.id !== currentUserId) {
      throw new HttpException(
        'You are not author of restaurant',
        HttpStatus.FORBIDDEN,
      );
    }

    const { floorId, ...updatedFields } = updateTableDto;

    Object.assign(table, updatedFields);

    if (floorId) {
      const floorToUpdate = await this.floorService.getById(floorId);

      if (!floorToUpdate) {
        errorHelper.addNewError(
          `Floor with id:${floorId} does not exist`,
          'floor',
        );
        throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
      }

      const restaurant = await this.restaurantService.getById(
        floorToUpdate.restaurant.id,
      );

      if (restaurant.user.id !== currentUserId) {
        throw new HttpException(
          'You are not author of restaurant',
          HttpStatus.FORBIDDEN,
        );
      }

      table.floor = floorToUpdate;
    }

    return this.tableRepository.save(table);
  }
}
