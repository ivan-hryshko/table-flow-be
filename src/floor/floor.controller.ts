import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Delete, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateFloorDto } from "./dto/createFloor.dto";
import { FloorService } from "./floor.service";
import { FloorResponseInterface } from "./types/floorResponse.interface";
import { FloorsResponseInterface } from "./types/floorsResponse.interface";
import { DeleteResult } from "typeorm";
import { DeleteFloorDto } from "./dto/deleteFloor.dto";
import { UpdateFloorDto } from "./dto/updateFloor.dto";

@Controller('api/v1')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body() createFloorDto: CreateFloorDto
  ): Promise<FloorResponseInterface> {
    const floor = await this.floorService.create(currentUser, createFloorDto)
    return this.floorService.buildFloorResponse(floor)
  }

  @Get('floors')
  @UseGuards(AuthGuard)
  async getByUser(
    @User('id') currentUserId: number,
  ): Promise<FloorsResponseInterface> {
    const floors = await this.floorService.getByUser({ userId: currentUserId })
    return this.floorService.buildFloorsResponse(floors)
  }

  @Delete('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async delete (
    @User('id') currentUserId: number,
    @Body('floor') deleteFloorDto: DeleteFloorDto
    ): Promise<DeleteResult> {
    return await this.floorService.delete(deleteFloorDto, currentUserId)
  }

  @Put('floor')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async update (
    @User('id') currentUserId: number,
    @Body('floor') updateFloorDto: UpdateFloorDto
    ): Promise<FloorResponseInterface> {
    const floor = await this.floorService.update(updateFloorDto, currentUserId)
    return this.floorService.buildFloorResponse(floor)
  }
}
