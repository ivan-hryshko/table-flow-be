import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateTableRequestDto } from './models/dtos/request/create-table.request.dto';
import { TableResponseInterface } from './models/types/tableResponse.interface';
import { TablesResponseInterface } from './models/types/tablesResponse.interface';
import { TableService } from './services/table.service';
import { DeleteTableRequestDto } from './models/dtos/request/delete-table.request.dto';

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

  @Get('tables/:id')
  @UseGuards(AuthGuard)
  async getById(@Param('id') tableId: number): Promise<TableResponseInterface> {
    const table = await this.tableService.getById(tableId);
    return this.tableService.buildTableResponse(table);
  }

  @Delete('table')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body('table') deleteTableDto: DeleteTableRequestDto,
  ): Promise<DeleteResult> {
    return await this.tableService.delete(deleteTableDto, currentUserId);
  }
}
