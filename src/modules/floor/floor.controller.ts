import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateFloorRequestDto } from './models/dtos/request/create-floor.request.dto';
import { DeleteFloorRequestDto } from './models/dtos/request/delete-floor.request.dto';
import { UpdateFloorRequestDto } from './models/dtos/request/update-floor.request.dto';
import { CreateFloorResponseDto } from './models/dtos/response/create-floor.response.dto';
import { FloorsResponseDto } from './models/dtos/response/floors.response.dto';
import { UpdateFloorResponseDto } from './models/dtos/response/update-floor.response.dto';
import { FloorService } from './services/floor.service';

@ApiTags('Floor')
@Controller('api/v1')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createFloorDto: CreateFloorRequestDto,
  ): Promise<CreateFloorResponseDto> {
    return await this.floorService.create(currentUser, createFloorDto);
  }

  @Get('floors')
  @UseGuards(AuthGuard)
  async getAllByUserId(
    @User('id') currentUserId: number,
  ): Promise<FloorsResponseDto> {
    const floors = await this.floorService.getByUser({ userId: currentUserId });
    return this.floorService.buildFloorsResponse(floors);
  }

  @Delete('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body() deleteFloorDto: DeleteFloorRequestDto,
  ): Promise<DeleteResult> {
    return await this.floorService.delete(deleteFloorDto, currentUserId);
  }

  @Put('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body() updateFloorDto: UpdateFloorRequestDto,
  ): Promise<UpdateFloorResponseDto> {
    return await this.floorService.update(updateFloorDto, currentUserId);
  }
}
