import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { LoginUserRequestDto } from './login-user.request.dto';

export class LoginUserWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => LoginUserRequestDto)
  user: LoginUserRequestDto;
}
