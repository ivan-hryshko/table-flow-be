import { ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { ReserveService } from './services/reserve.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { UserEntity } from '../user/user.entity';
import { CreateReserveWrapperRequestDto } from './models/dtos/request/create-reserve-wrapper.request.dto';
import { CreateReserveWrapperResponseDto } from './models/dtos/response/create-reserve-wrapper.response.dto';

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
}
