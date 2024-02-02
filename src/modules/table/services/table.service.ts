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
import { FloorEntity } from '../../floor/floor.entity';

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

  async getByUser(query: TableQueryParams): Promise<TableEntity[]> {
    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.floor', 'floor')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .where('user.id = :userId', { userId: query.userId })
      .orderBy('table.createAt', 'DESC')
      .getMany();
  }

  async getById(tableId: number): Promise<TableEntity> {
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
    currentUserId: number,
    restaurantId: number,
  ): Promise<TableEntity[]> {
    await this.restaurantService.validateRestaurantOwnership(
      currentUserId,
      restaurantId,
    );

    return this.tableRepository
      .createQueryBuilder('table')
      .innerJoin('table.restaurant', 'restaurant')
      .innerJoin('restaurant.user', 'user')
      .where('restaurant.id = :restaurantId', { restaurantId })
      .orderBy('table.createAt', 'DESC')
      .getMany();
  }

  async delete(currentUserId: number, tableId: number): Promise<void> {
    await this.validateTableOwnership(currentUserId, tableId);

    await this.tableRepository.delete(tableId);
  }

  async update(
    currentUserId: number,
    updateTableDto: UpdateTableRequestDto,
  ): Promise<TableEntity> {
    const { id, floorId }: { id: number; floorId?: number } = updateTableDto;

    const table: TableEntity = await this.validateTableOwnership(
      currentUserId,
      id,
    );

    await this.restaurantService.validateRestaurantOwnership(
      currentUserId,
      table.restaurantId,
    );

    table.floor = await this.floorService.validateFloorForUserAndRestaurant(
      currentUserId,
      table.restaurantId,
      floorId,
    );

    Object.assign(table, updateTableDto);

    return await this.tableRepository.save(table);
  }

  async validateTableOwnership(
    currentUserId: number,
    tableId: number,
  ): Promise<TableEntity> {
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

    return table;
  }
}
