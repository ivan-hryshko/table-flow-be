import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateTableDto } from "./dto/createTable.dto";
import { TableService } from "./table.service";
import { TableResponseInterface } from "./types/tableResponse.interface";
import { TablesResponseInterface } from "./types/tablesResponse.interface";

@Controller('api/v1')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('table')
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('table') createTableDto: CreateTableDto
  ): Promise<TableResponseInterface> {
    const table = await this.tableService.create(createTableDto)
    return this.tableService.buildTableResponse(table)
  }

  @Get('tables')
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<TablesResponseInterface> {
    const tables = await this.tableService.getByUser({ userId: currentUserId })
    return this.tableService.buildTablesResponse(tables)
  }
}
