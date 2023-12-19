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
import { ApiTags } from '@nestjs/swagger';
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
import { UpdateTableWrapperResponseDto } from './models/dtos/response/update-table-wrapper.response.dto';
import { TableResponseInterface } from './models/types/tableResponse.interface';
import { TablesResponseInterface } from './models/types/tablesResponse.interface';
import { TableService } from './services/table.service';

@ApiTags('Table')
@Controller('api/v1/tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  // @UsePipes(new createTablePipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createTableDto: CreateTableWrapperRequestDto,
  ): Promise<CreateTableWrapperResponseDto> {
    const table = await this.tableService.create(createTableDto.table);
    return this.tableService.buildTableResponse(table);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<TablesResponseInterface> {
    const tables = await this.tableService.getByUser({ userId: currentUserId });
    return this.tableService.buildTablesResponse(tables);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(@Param('id') tableId: number): Promise<TableResponseInterface> {
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

  @Delete()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body() deleteTableDto: DeleteTableWrapperRequestDto,
  ): Promise<DeleteResult> {
    return await this.tableService.delete(deleteTableDto.table, currentUserId);
  }

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
