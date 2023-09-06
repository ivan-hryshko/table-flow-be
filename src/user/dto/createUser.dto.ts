import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string
}