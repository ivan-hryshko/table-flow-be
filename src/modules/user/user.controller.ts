import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from './decorators/user.decorator';
import { CreateUserRequestDto } from './models/dtos/request/create-user.request.dto';
import { LoginUserDto } from './models/dtos/request/login-user.request.dto';
import { UpdateUserDto } from './models/dtos/request/updateUser.dto';
import { UserResponseInterface } from './models/types/userResponse.interface';
import { UserService } from './services/user.service';
import { UserEntity } from './user.entity';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserRequestDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body('user') loginDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      updateUserDto,
      currentUserId,
    );
    return this.userService.buildUserResponse(user);
  }
}
