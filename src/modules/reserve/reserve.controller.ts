import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { ErrorHelper } from '../../utils/errors/errorshelper.helper';
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
    const errorHelper = new ErrorHelper();

    const reserve = await this.reserveService.getById(currentUserId, reserveId);
    if (!reserve) {
      errorHelper.addNewError(
        `Резерву з заданим id:${reserveId} не існує або у вас нема прав доступу`,
        'reserve',
      );

      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }

    return this.reserveService.buildReserveResponse(reserve);
  }
}
