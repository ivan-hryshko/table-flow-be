import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { ErrorHelper } from '../../utils/errors/errorshelper.helper';
import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateTableWrapperRequestDto } from './models/dtos/request/create-table-wrapper.request.dto';
import { DeleteTableWrapperRequestDto } from './models/dtos/request/delete-table-wrapper.request.dto';
import { UpdateTableWrapperRequestDto } from './models/dtos/request/update-table-wrapper.request.dto';
import { CreateTableWrapperResponseDto } from './models/dtos/response/create-table-wrapper.response.dto';
import { TableWrapperResponseDto } from './models/dtos/response/table-wrapper.response.dto';
import { TablesWithCountResponseDto } from './models/dtos/response/tables-with-count.response.dto';
import { UpdateTableWrapperResponseDto } from './models/dtos/response/update-table-wrapper.response.dto';
import { TableService } from './services/table.service';
import { TableEntity } from './table.entity';

@ApiTags('Table')
@Controller('api/v1/tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @ApiOperation({ description: 'Create table' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User('id') currentUserId: number,
    @Body() createTableDto: CreateTableWrapperRequestDto,
  ): Promise<CreateTableWrapperResponseDto> {
    const table: TableEntity = await this.tableService.create(
      currentUserId,
      createTableDto.table,
    );
    return this.tableService.buildTableResponse(table);
  }

  @ApiOperation({ description: 'Get all tables by user' })
  @Get()
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<TablesWithCountResponseDto> {
    const tables = await this.tableService.getByUser({ userId: currentUserId });
    return this.tableService.buildTablesResponse(tables);
  }

  @ApiOperation({ description: 'Get table' })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(
    @Param('id') tableId: number,
  ): Promise<TableWrapperResponseDto> {
    const errorHelper = new ErrorHelper();
    const table = await this.tableService.getById(tableId);
    if (!table) {
      errorHelper.addNewError(
        `Table with given id:${tableId} does not exist`,
        'table',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return this.tableService.buildTableResponse(table);
  }

  @ApiOperation({ description: 'Get all tables by restaurant id' })
  @Get('/restid/:restaurantId')
  @UseGuards(AuthGuard)
  async getAllTablesByRestaurantId(
    @User('id') currentUserId: number,
    @Param('restaurantId') restaurantId: number,
  ): Promise<TablesWithCountResponseDto> {
    const tables = await this.tableService.getAllTablesByRestaurantId(
      restaurantId,
      currentUserId,
    );
    return this.tableService.buildTablesResponse(tables);
  }

  @ApiOperation({ description: 'Delete table' })
  @Delete()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body() deleteTableDto: DeleteTableWrapperRequestDto,
  ): Promise<DeleteResult> {
    return await this.tableService.delete(deleteTableDto.table, currentUserId);
  }

  @ApiOperation({ description: 'Update table' })
  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body() updateTableDto: UpdateTableWrapperRequestDto,
  ): Promise<UpdateTableWrapperResponseDto> {
    const table = await this.tableService.update(
      updateTableDto.table,
      currentUserId,
    );
    return this.tableService.buildTableResponse(table);
  }
}
