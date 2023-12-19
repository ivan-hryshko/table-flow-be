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
import { CreateUserWrapperRequestDto } from './models/dtos/request/create-user-wrapper.request.dto';
import { LoginUserWrapperRequestDto } from './models/dtos/request/login-user-wrapper.request.dto';
import { UpdateUserWrapperRequestDto } from './models/dtos/request/update-user-wrapper.request.dto';
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
    @Body() createUserDto: CreateUserWrapperRequestDto,
  ): Promise<CreateUserResponseDto> {
    const user = await this.userService.createUser(createUserDto.user);
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'User authentication' })
  @Post('login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body() loginDto: LoginUserWrapperRequestDto,
  ): Promise<LoginUserResponseDto> {
    const user = await this.userService.loginUser(loginDto.user);
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'Get current user' })
  @Get()
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<CreateUserResponseDto> {
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'Update user' })
  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateUser(
    @User('id') currentUserId: number,
    @Body() updateUserDto: UpdateUserWrapperRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.updateUser(
      updateUserDto.user,
      currentUserId,
    );
    return this.userService.buildUserResponse(user);
  }
}
