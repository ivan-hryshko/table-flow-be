import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { FloorEntity } from './floor.entity';
import { FloorService } from './services/floor.service';
import { CreateFloorWrapperRequestDto } from './models/dtos/request/create-floor-wrapper.request.dto';
import { DeleteFloorWrapperRequestDto } from './models/dtos/request/delete-floor-wrapper.request.dto';
import { UpdateFloorWrapperRequestDto } from './models/dtos/request/update-floor-wrapper.request.dto';
import { CreateFloorWrapperResponseDto } from './models/dtos/response/create-floor-wrapper.response.dto';
import { UpdateFloorWrapperResponseDto } from './models/dtos/response/update-floor-wrapper.response.dto';
import { FloorsResponseDto } from './models/dtos/response/floors.response.dto';
import { FloorResponseDto } from './models/dtos/response/floor.response.dto';

@ApiTags('Floor')
@Controller('api/v1')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @ApiOperation({ description: 'Create floor' })
  @Post('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createFloorDto: CreateFloorWrapperRequestDto,
  ): Promise<CreateFloorWrapperResponseDto> {
    const floor = await this.floorService.create(
      currentUser,
      createFloorDto.floor,
    );
    return this.floorService.buildFloorResponse(floor);
  }

  @ApiOperation({ description: 'Get all floors by User' })
  @Get('floors')
  @UseGuards(AuthGuard)
  async getAllByUserId(
    @User('id') currentUserId: number,
  ): Promise<FloorsResponseDto> {
    const floors = await this.floorService.getByUser(currentUserId);
    return this.floorService.buildFloorsResponse(floors);
  }

  @ApiOperation({ description: 'Get floor by Id' })
  @Get('floors/:id')
  @UseGuards(AuthGuard)
  async getById(@Param('id') floorId: number) {
    const floor: FloorEntity = await this.floorService.getById(floorId);

    if (!floor) {
      throw new NotFoundException(`Floor with id ${floorId} not found`);
    }

    return this.floorService.buildFloorResponse(floor);
  }

  @ApiOperation({ description: 'Delete floor' })
  @Delete('floors/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Param('id') floorId: number,
  ): Promise<DeleteResult> {
    return await this.floorService.delete(currentUserId, floorId);
  }

  @ApiOperation({ description: 'Update floor' })
  @Put('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Body() updateFloorDto: UpdateFloorWrapperRequestDto,
  ): Promise<UpdateFloorWrapperResponseDto> {
    const floor = await this.floorService.update(
      updateFloorDto.floor,
      currentUserId,
    );
    return this.floorService.buildFloorResponse(floor);
  }
}
