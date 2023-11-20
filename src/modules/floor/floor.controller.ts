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
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateFloorRequestDto } from './model/dtos/request/create-floor.request.dto';
import { DeleteFloorRequestDto } from './model/dtos/request/delete-floor.request.dto';
import { UpdateFloorRequestDto } from './model/dtos/request/update-floor.request.dto';
import { FloorResponseInterface } from './model/types/floorResponse.interface';
import { FloorsResponseInterface } from './model/types/floorsResponse.interface';
import { FloorService } from './services/floor.service';

@Controller('api/v1')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createFloorDto: CreateFloorRequestDto,
  ): Promise<FloorResponseInterface> {
    const floor = await this.floorService.create(currentUser, createFloorDto);
    return this.floorService.buildFloorResponse(floor);
  }

  @Get('floors')
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<FloorsResponseInterface> {
    const floors = await this.floorService.getByUser({ userId: currentUserId });
    return this.floorService.buildFloorsResponse(floors);
  }

  @Delete('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body('floor') deleteFloorDto: DeleteFloorRequestDto,
  ): Promise<DeleteResult> {
    return await this.floorService.delete(deleteFloorDto, currentUserId);
  }

  @Put('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body('floor') updateFloorDto: UpdateFloorRequestDto,
  ): Promise<FloorResponseInterface> {
    const floor = await this.floorService.update(updateFloorDto, currentUserId);
    return this.floorService.buildFloorResponse(floor);
  }
}
