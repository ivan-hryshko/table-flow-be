import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TableEntity } from "./table.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTableDto } from "./dto/createTable.dto";
import { UserEntity } from "../user/user.entity";
import { TableResponseInterface } from "./types/tableResponse.interface";
import { TableQueryParams } from "./types/tableQuery.types";
import { TablesResponseInterface } from "./types/tablesResponse.interface";
import { RestaurantService } from "../restaurant/restaurant.service";
import { ErrorHelper } from "../shared/errors/errorshelper.helper";
import { FloorService } from "../floor/floor.service";

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository:
    Repository<TableEntity>,
    private readonly restaurantService: RestaurantService,
    private readonly floorService: FloorService
  ) {}

  buildTableResponse(table: TableEntity): TableResponseInterface {
    return {
      table
    }
  }

  buildTablesResponse(tables: TableEntity[]): TablesResponseInterface {
    return {
      tables,
      tablesCount: tables.length,
    }
  }

  async create(createTableDto: CreateTableDto): Promise<TableEntity> {
    const errorHelper = new ErrorHelper()
    const restaurant = await this.restaurantService.getById(createTableDto.restaurantId)
    if (!restaurant) {
      errorHelper.addNewError(`Restaurant with given id:${createTableDto.restaurantId} does not exist`, 'restaurant')
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND)
    }

    const floor = await this.floorService.getById(createTableDto.floorId)
    if (!floor) {
      errorHelper.addNewError(`Floor with given id:${createTableDto.floorId} does not exist`, 'restaurant')
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND)
    }

    const newTable = new TableEntity()
    Object.assign(newTable, createTableDto)
    newTable.restaurant = restaurant
    return await this.tableRepository.save(newTable)
  }

  async getByUser(query: TableQueryParams) {
    return this.tableRepository
      .createQueryBuilder("table")
      .innerJoinAndSelect("table.user", "user")
      .innerJoinAndSelect("table.floor", "floor")
      .where('user.id = :userId', { userId: query.userId })
      .getMany()
  }
}
