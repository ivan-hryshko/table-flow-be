import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateTableWrapperRequestDto } from './models/dtos/request/create-table-wrapper.request.dto';
import { UpdateTableWrapperRequestDto } from './models/dtos/request/update-table-wrapper.request.dto';
import { CreateTableWrapperResponseDto } from './models/dtos/response/create-table-wrapper.response.dto';
import { TableWrapperResponseDto } from './models/dtos/response/table-wrapper.response.dto';
import { TablesWithCountResponseDto } from './models/dtos/response/tables-with-count.response.dto';
import { UpdateTableWrapperResponseDto } from './models/dtos/response/update-table-wrapper.response.dto';
import { TableService } from './services/table.service';
import { TableEntity } from './table.entity';
import { IntegerValidationPipe } from '../../utils/pipes/integer-validation.pipe';

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
    const tables: TableEntity[] = await this.tableService.getByUser({
      userId: currentUserId,
    });

    return this.tableService.buildTablesResponse(tables);
  }

  @ApiOperation({ description: 'Get table' })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(
    @User('id') currentUserId: number,
    @Param('id', IntegerValidationPipe) tableId: number,
  ): Promise<TableWrapperResponseDto> {
    const table: TableEntity = await this.tableService.getById(
      currentUserId,
      tableId,
    );

    return this.tableService.buildTableResponse(table);
  }

  @ApiOperation({ description: 'Get all tables by restaurant id' })
  @Get('/restid/:restaurantId')
  @UseGuards(AuthGuard)
  async getAllTablesByRestaurantId(
    @User('id') currentUserId: number,
    @Param('restaurantId', IntegerValidationPipe) restaurantId: number,
  ): Promise<TablesWithCountResponseDto> {
    const tables: TableEntity[] =
      await this.tableService.getAllTablesByRestaurantId(
        currentUserId,
        restaurantId,
      );

    return this.tableService.buildTablesResponse(tables);
  }

  @ApiOperation({ description: 'Delete table' })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Param('id', IntegerValidationPipe) tableId: number,
  ): Promise<void> {
    await this.tableService.delete(currentUserId, tableId);
  }

  @ApiOperation({ description: 'Update table' })
  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body() updateTableDto: UpdateTableWrapperRequestDto,
  ): Promise<UpdateTableWrapperResponseDto> {
    const table: TableEntity = await this.tableService.update(
      currentUserId,
      updateTableDto.table,
    );

    return this.tableService.buildTableResponse(table);
  }
}
