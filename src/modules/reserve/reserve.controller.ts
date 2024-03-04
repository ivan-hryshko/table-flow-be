import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

import { ReserveService } from './services/reserve.service';
import { ReserveEntity } from './reserve.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { IntegerValidationPipe } from '../../utils/pipes/integer-validation.pipe';
import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { CreateReserveWrapperRequestDto } from './models/dtos/request/create-reserve-wrapper.request.dto';
import { CreateReserveWrapperResponseDto } from './models/dtos/response/create-reserve-wrapper.response.dto';
import { ReserveWrapperResponseDto } from './models/dtos/response/reserve-wrapper.response.dto';
import { UpdateReserveWrapperRequestDto } from './models/dtos/request/update-reserve-wrapper.request.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Reserve')
@Controller('api/v1/reserves')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @ApiOperation({ description: 'Create reserve' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User('id') currentUserId: number,
    @Body() createReserveDto: CreateReserveWrapperRequestDto,
  ): Promise<CreateReserveWrapperResponseDto> {
    const reserve: ReserveEntity = await this.reserveService.create(
      currentUserId,
      createReserveDto.reserve,
    );
    return this.reserveService.buildReserveResponse(reserve);
  }

  @ApiOperation({ description: 'Get reserve' })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(
    @User('id') currentUserId: number,
    @Param('id') reserveId: number,
  ): Promise<ReserveWrapperResponseDto> {
    const reserve: ReserveEntity = await this.reserveService.getById(
      currentUserId,
      reserveId,
    );

    return this.reserveService.buildReserveResponse(reserve);
  }

  @ApiOperation({ description: 'Delete reserve' })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Param('id', IntegerValidationPipe) reserveId: number,
  ): Promise<DeleteResult> {
    return await this.reserveService.delete(currentUserId, reserveId);
  }

  @ApiOperation({ description: 'Update reserve' })
  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body() updateReserveDto: UpdateReserveWrapperRequestDto,
  ): Promise<UpdateReserveWrapperRequestDto> {
    const reserve: ReserveEntity = await this.reserveService.update(
      currentUserId,
      updateReserveDto.reserve,
    );

    return this.reserveService.buildReserveResponse(reserve);
  }
}
