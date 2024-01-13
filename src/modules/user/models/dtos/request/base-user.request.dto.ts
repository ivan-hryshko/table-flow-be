import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BaseUserRequestDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsString()
  readonly bio: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}
