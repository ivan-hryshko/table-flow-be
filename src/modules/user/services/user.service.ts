import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { JWT_SECRET } from '../../../config';
import { CreateUserRequestDto } from '../models/dtos/request/create-user.request.dto';
import { LoginUserRequestDto } from '../models/dtos/request/login-user.request.dto';
import { UpdateUserRequestDto } from '../models/dtos/request/update-user.request.dto';
import { UserResponseDto } from '../models/dtos/response/user.response.dto';
import { UserEntity } from '../user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserRequestDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (userByEmail) {
      throw new HttpException('Email зайнятий', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserRequestDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'email', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(
        'Облікові дані не є дійсними',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Пароль невірний',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;
    return user;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): { user: UserResponseDto } {
    return {
      user: {
        id: user.id,
        email: user.email,
        bio: user.bio,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        token: this.generateJwt(user),
      },
    };
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(
    updateUserDto: UpdateUserRequestDto,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
}
