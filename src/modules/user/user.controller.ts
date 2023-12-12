import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from './decorators/user.decorator';
import { CreateUserRequestDto } from './models/dtos/request/create-user.request.dto';
import { LoginUserRequestDto } from './models/dtos/request/login-user.request.dto';
import { UpdateUserRequestDto } from './models/dtos/request/update-user.request.dto';
import { CreateUserResponseDto } from './models/dtos/response/create-user.response.dto';
import { LoginUserResponseDto } from './models/dtos/response/login-user.response.dto';
import { UpdateUserResponseDto } from './models/dtos/response/update-user.response.dto';
import { UserService } from './services/user.service';
import { UserEntity } from './user.entity';

@ApiTags('User')
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'User registration' })
  @Post()
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'User authentication' })
  @Post('login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body('user') loginDto: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    const user = await this.userService.loginUser(loginDto);
    return this.userService.buildUserResponse(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<CreateUserResponseDto> {
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.updateUser(
      updateUserDto,
      currentUserId,
    );
    return this.userService.buildUserResponse(user);
  }
}
