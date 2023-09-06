import { IsEmail } from "class-validator"

export class UpdateUserDto {
  @IsEmail()
  readonly email: string

  readonly password: string

  readonly bio: string

  readonly image: string
}