import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { ReserveService } from "./services/reserve.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { User } from '../user/decorators/user.decorator';
import { BackendValidationPipe } from "../../utils/pipes/backendValidation.pipe";
import { UserEntity } from "../user/user.entity";
import { CreateReserveRequestDto } from "./models/dtos/request/create-reserve.request.dto";
import { ReserveResponseInterface } from "./models/types/reserveResponse.interface";

@Controller('api/v1/reserves')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('reserve') createReserveDto: CreateReserveRequestDto,
  ): Promise<ReserveResponseInterface> {
    const reserve = await this.reserveService.create(createReserveDto);
    return this.reserveService.buildReserveResponse(reserve)
  }
}