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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateFloorWrapperRequestDto } from './models/dtos/request/create-floor-wrapper.request.dto';
import { DeleteFloorWrapperRequestDto } from './models/dtos/request/delete-floor-wrapper.request.dto';
import { UpdateFloorWrapperRequestDto } from './models/dtos/request/update-floor-wrapper.request.dto';
import { CreateFloorWrapperResponseDto } from './models/dtos/response/create-floor-wrapper.response.dto';
import { FloorsResponseDto } from './models/dtos/response/floors.response.dto';
import { UpdateFloorWrapperResponseDto } from './models/dtos/response/update-floor-wrapper.response.dto';
import { FloorService } from './services/floor.service';

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
    const floors = await this.floorService.getByUser({ userId: currentUserId });
    return this.floorService.buildFloorsResponse(floors);
  }

  @ApiOperation({ description: 'Delete floor' })
  @Delete('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Body() deleteFloorDto: DeleteFloorWrapperRequestDto,
  ): Promise<DeleteResult> {
    return await this.floorService.delete(deleteFloorDto.floor, currentUserId);
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
