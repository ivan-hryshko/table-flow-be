import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
<<<<<<< HEAD
=======
  Patch,
>>>>>>> 03a06b2 (Progress)
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { IntegerValidationPipe } from '../../utils/pipes/integer-validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { FloorEntity } from './floor.entity';
import { CreateFloorWrapperRequestDto } from './models/dtos/request/create-floor-wrapper.request.dto';
import { UpdateFloorWrapperRequestDto } from './models/dtos/request/update-floor-wrapper.request.dto';
import { CreateFloorWrapperResponseDto } from './models/dtos/response/create-floor-wrapper.response.dto';
import { FloorWrapperResponseDto } from './models/dtos/response/floor-wrapper.response.dto';
import { FloorsResponseDto } from './models/dtos/response/floors.response.dto';
import { UpdateFloorWrapperResponseDto } from './models/dtos/response/update-floor-wrapper.response.dto';
import { FloorService } from './services/floor.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Floor')
@Controller('api/v1/floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @ApiOperation({ description: 'Create floor' })
  @Post()
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
  @Get()
  @UseGuards(AuthGuard)
  async getAllByUserId(
    @User('id') currentUserId: number,
  ): Promise<FloorsResponseDto> {
    const floors = await this.floorService.getByUser(currentUserId);
    return this.floorService.buildFloorsResponse(floors);
  }

  @ApiOperation({ description: 'Get floor by Id' })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getById(
    @Param('id', IntegerValidationPipe) floorId: number,
  ): Promise<FloorWrapperResponseDto> {
    const floor: FloorEntity = await this.floorService.getById(floorId);

    if (!floor) {
      throw new NotFoundException(`Floor with id ${floorId} not found`);
    }

    return this.floorService.buildFloorResponse(floor);
  }

  @ApiOperation({ description: 'Delete floor' })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new BackendValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Param('id', IntegerValidationPipe) floorId: number,
  ): Promise<void> {
    await this.floorService.delete(currentUserId, floorId);
  }

  @ApiOperation({ description: 'Update floor' })
  @Put()
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

<<<<<<< HEAD
  @Patch('/:id/image')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateImage(
    @User('id') currentUserId: number,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const floor = await this.floorService.updateImage(id, file, currentUserId);
    return this.floorService.buildFloorResponse(floor);
=======
  @Patch('floor')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
>>>>>>> 03a06b2 (Progress)
  }
}
