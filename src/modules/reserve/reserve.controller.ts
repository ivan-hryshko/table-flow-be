import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
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
  async getById(@Param('id') reserveId: number) {
    const errorHelper = new ErrorHelper();

    const reserve = await this.reserveService.getById(reserveId);
    // Error #1 //
    if (!reserve) {
      errorHelper.addNewError(
        `Reserve with given id:${reserveId} does not exist`,
        'reserve',
      );
      throw new HttpException(errorHelper.getErrors(), HttpStatus.NOT_FOUND);
    }
    // Response #1 \\
    // {
    //   "errors": {
    //        "reserve": "Reserve with given id:1776 does not exist"
    // }
    // }

    // Error #2 \\
    // if (!reserve)
    //   throw new NotFoundException(
    //     'Reserve with given id:${reserveId} does not exist',
    //   );
    // Response #2 \\
    // {
    //   "message": "Reserve with given id:${reserveId} does not exist",
    //   "error": "Not Found",
    //   "statusCode": 404
    // }

    return this.reserveService.buildReserveResponse(reserve);
  }
}
