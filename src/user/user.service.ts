import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/loginUser.dto";
import { compare } from 'bcrypt'
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository:
    Repository<UserEntity>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email
    })
    if (userByEmail) {
      throw new HttpException('Email taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new UserEntity()
    Object.assign(newUser, createUserDto)
    return await this.userRepository.save(newUser)
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
      email: loginUserDto.email
    }, { select: ['id', 'email', 'bio', 'image', 'password']})
        if (!user) {
      throw new HttpException('Credential are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const isPasswordCorrect = await compare(loginUserDto.password, user.password)
    if (!isPasswordCorrect) {
      throw new HttpException('Password is incorrect', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    delete user.password
    return user
  }

  generateJwt(user: UserEntity): string {
    return sign({
      id: user.id,
      email: user.email,
    }, JWT_SECRET)
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id)
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: number): Promise<UserEntity> {
    const user = await this.findById(userId)
    Object.assign(user, updateUserDto)
    return await this.userRepository.save(user)
  }
}