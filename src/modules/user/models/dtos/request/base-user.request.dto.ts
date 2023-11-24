import { IsEmail, IsNotEmpty } from 'class-validator';

export class BaseUserRequestDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
