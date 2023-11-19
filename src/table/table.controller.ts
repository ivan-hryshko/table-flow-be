import { User } from "../user/decorators/user.decorator";
import { AuthGuard } from "../user/guards/auth.guard";
import { UserEntity } from "../user/user.entity";
import { Body, Controller, Delete, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateTableDto } from "./dto/createTable.dto";
import { TableService } from "./table.service";
import { TableResponseInterface } from "./types/tableResponse.interface";
import { TablesResponseInterface } from "./types/tablesResponse.interface";
import { BackendValidationPipe } from "../shared/pipes/backendValidation.pipe";
import { createTablePipe } from "./pipes/createTable.pipe";

@Controller('api/v1')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('table')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  // @UsePipes(new createTablePipe())
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

  // @Delete('tables')
  // @UseGuards(AuthGuard)
  // async deleteByUser(
  //   @User('id') currentUserId: number,
  // ): Promise<TablesResponseInterface> {
  //   const tables = await this.tableService.deleteByUser({ userId: currentUserId })
  //   return this.tableService.buildTablesResponse(tables)
  // }

  /*
  async deleteByUser(
    @User('id') currentUserId: number,
  ): Promise<DeleteResult> {
    const result = await this.tableService.deleteByUser({ userId: currentUserId });
    return result;
  }
   */
}
