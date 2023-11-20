import { PickType } from '@nestjs/swagger';

import { BaseUserRequestDto } from './base-user.request.dto';

export class LoginUserDto extends PickType(BaseUserRequestDto, [
  'email',
  'password',
]) {}
