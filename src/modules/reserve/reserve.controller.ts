import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

import { ReserveService } from './services/reserve.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { UserEntity } from '../user/user.entity';
import { CreateReserveWrapperRequestDto } from './models/dtos/request/create-reserve-wrapper.request.dto';
import { CreateReserveWrapperResponseDto } from './models/dtos/response/create-reserve-wrapper.response.dto';
import { ReserveWrapperResponseDto } from './models/dtos/response/reserve-wrapper.response.dto';

@ApiTags('Reserve')
@Controller('api/v1/reserves')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @ApiOperation({ description: 'Create reserve' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createReserveDto: CreateReserveWrapperRequestDto,
  ): Promise<CreateReserveWrapperResponseDto> {
    const reserve = await this.reserveService.create(createReserveDto.reserve);
    return this.reserveService.buildReserveResponse(reserve);
  }

  @ApiOperation({ description: 'Get reserve' })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(
    @User('id') currentUserId: number,
    @Param('id') reserveId: number,
  ): Promise<ReserveWrapperResponseDto> {
    const reserve = await this.reserveService.getById(currentUserId, reserveId);

    return this.reserveService.buildReserveResponse(reserve);
  }

  @ApiOperation({ description: 'Delete reserve' })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Param('id') reserveId: number,
  ) {
    return await this.reserveService.delete(currentUserId, reserveId);
  }
}
