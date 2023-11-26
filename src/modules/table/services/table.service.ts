import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorHelper } from '../../../utils/errors/errorshelper.helper';
import { FloorService } from '../../floor/services/floor.service';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { CreateTableRequestDto } from '../models/dtos/request/create-table.request.dto';
import { TableQueryParams } from '../models/types/tableQuery.types';
import { TableResponseInterface } from '../models/types/tableResponse.interface';
import { TablesResponseInterface } from '../models/types/tablesResponse.interface';
import { TableEntity } from '../table.entity';
import { DeleteTableRequestDto } from '../models/dtos/request/delete-table.request.dto';

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
    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.floor', 'floor')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .where('table.id = :tableId', { tableId })
      .getOne();
  }

  async delete(deleteTableDto: DeleteTableRequestDto, currentUserId: number) {
    const errorHelper = new ErrorHelper();
    const table = await this.getById(deleteTableDto.id);

    console.log('table >>>>>>', table);

    if (!table) {
      errorHelper.addNewError(
        `Table with given id:${deleteTableDto.id} does not exist`,
        'restaurant',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return this.tableRepository.delete({ id: deleteTableDto.id });
  }
}
