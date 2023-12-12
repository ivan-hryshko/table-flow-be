import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateTableRequestDto } from './models/dtos/request/create-table.request.dto';
import { CreateTableResponseDto } from './models/dtos/response/create-table.response.dto';
import { TablesWithCountResponseDto } from './models/dtos/response/tables-with-count.response.dto';
import { TableService } from './services/table.service';

@ApiTags('Table')
@Controller('api/v1')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('table')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  // @UsePipes(new createTablePipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createTableDto: CreateTableRequestDto,
  ): Promise<CreateTableResponseDto> {
    const table = await this.tableService.create(createTableDto);
    return this.tableService.buildTableResponse(table);
  }

  @Get('tables')
  @UseGuards(AuthGuard)
  async getAllByUserId(
    @User('id') currentUserId: number,
  ): Promise<TablesWithCountResponseDto> {
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
