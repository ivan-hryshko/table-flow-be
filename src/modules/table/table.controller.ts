import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { TableService } from './services/table.service';
import { TableResponseInterface } from './models/types/tableResponse.interface';
import { TablesResponseInterface } from './models/types/tablesResponse.interface';
import { CreateTableRequestDto } from './models/dtos/request/create-table.request.dto';
import { DeleteTableRequestDto } from './models/dtos/request/delete-table.request.dto';
import { UpdateTableRequestDto } from './models/dtos/request/update-table.request.dto';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantResponseInterface } from '../restaurant/models/types/restaurantResponse.interface';
import { RestaurantsResponseInterface } from '../restaurant/models/types/restaurantsResponse.interface';
import { TableEntity } from './table.entity';

@Controller('api/v1')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  buildTableResponse(table: TableEntity): TableResponseInterface {
    return {
      table,
    };
  }

  buildRTableResponse(tables: TableEntity[]): TablesResponseInterface {
    return {
      tables,
      tablesCount: tables.length,
    };
  }

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

  @Delete('tables')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body('table') deleteTableDto: DeleteTableRequestDto,
  ): Promise<DeleteResult> {
    return await this.tableService.delete(deleteTableDto, currentUserId);
  }

  @Put('tables')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body('table') updateTableDto: UpdateTableRequestDto,
  ): Promise<TableResponseInterface> {
    const table = await this.tableService.update(
      updateTableDto,
      currentUserId,
    );
    return this.tableService.buildTableResponse(table);
  }
}
