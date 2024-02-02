import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { BackendValidationPipe } from '../../utils/pipes/backendValidation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from './decorators/user.decorator';
import { CreateUserWrapperRequestDto } from './models/dtos/request/create-user-wrapper.request.dto';
import { LoginUserWrapperRequestDto } from './models/dtos/request/login-user-wrapper.request.dto';
import { UpdateUserWrapperRequestDto } from './models/dtos/request/update-user-wrapper.request.dto';
import { CreateUserWrapperResponseDto } from './models/dtos/response/create-user-wrapper.response.dto';
import { LoginUserWrapperResponseDto } from './models/dtos/response/login-user-wrapper.response.dto';
import { UpdateUserWrapperResponseDto } from './models/dtos/response/update-user-wrapper.response.dto';
import { UserService } from './services/user.service';
import { UserEntity } from './user.entity';

@ApiTags('User')
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'User registration' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @Post()
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserWrapperRequestDto,
  ): Promise<CreateUserWrapperResponseDto> {
    const user = await this.userService.createUser(createUserDto.user);
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'User authentication' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @Post('login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body() loginDto: LoginUserWrapperRequestDto,
  ): Promise<LoginUserWrapperResponseDto> {
    const user = await this.userService.loginUser(loginDto.user);
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'Get current user' })
  @Get()
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
  ): Promise<CreateUserWrapperResponseDto> {
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ description: 'Update user' })
  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateUser(
    @User('id') currentUserId: number,
    @Body() updateUserDto: UpdateUserWrapperRequestDto,
  ): Promise<UpdateUserWrapperResponseDto> {
    const user = await this.userService.updateUser(
      updateUserDto.user,
      currentUserId,
    );
    return this.userService.buildUserResponse(user);
  }
}
