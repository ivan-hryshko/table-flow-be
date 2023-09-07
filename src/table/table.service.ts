import { Injectable } from "@nestjs/common";
import { TableEntity } from "./table.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTableDto } from "./dto/createTable.dto";
import { UserEntity } from "@app/user/user.entity";
import { TableResponseInterface } from "./types/tableResponse.interface";
import { TableQueryParams } from "./types/tableQuery.types";
import { TablesResponseInterface } from "./types/tablesResponse.interface";
import { RestaurantService } from "@app/restaurant/restaurant.service";

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository:
    Repository<TableEntity>,
    private readonly restaurantService: RestaurantService
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
    const newTable = new TableEntity()
    Object.assign(newTable, createTableDto)
    newTable.restaurant = await this.restaurantService.getById(createTableDto.restaurantId)
    return await this.tableRepository.save(newTable)
  }

  async getByUser(query: TableQueryParams) {
    return this.tableRepository
      .createQueryBuilder("table")
      .innerJoinAndSelect("table.user", "user")
      .where('user.id = :userId', { userId: query.userId })
      .getMany()
  }
}
