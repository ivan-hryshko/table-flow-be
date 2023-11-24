import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateTableRequestDto } from './models/dtos/request/create-table.request.dto';
import { TableResponseInterface } from './models/types/tableResponse.interface';
import { TablesResponseInterface } from './models/types/tablesResponse.interface';
import { TableService } from './services/table.service';

@Controller('api/v1')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('table')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  // @UsePipes(new createTablePipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('table') createTableDto: CreateTableRequestDto,
  ): Promise<TableResponseInterface> {
    const table = await this.tableService.create(createTableDto);
    return this.tableService.buildTableResponse(table);
  }

  @Get('tables')
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<TablesResponseInterface> {
    const tables = await this.tableService.getByUser({ userId: currentUserId });
    return this.tableService.buildTablesResponse(tables);
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
