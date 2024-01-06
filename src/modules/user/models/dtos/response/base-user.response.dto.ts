import { IsEmail, IsNotEmpty } from 'class-validator';

export class BaseUserResponseDto {
  id: number;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly bio: string;

  readonly image: string;

  readonly firstName: string;

  readonly lastName: string;
}
