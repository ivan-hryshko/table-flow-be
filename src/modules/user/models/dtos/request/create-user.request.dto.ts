import { PickType } from '@nestjs/swagger';

import { BaseUserRequestDto } from './base-user.request.dto';

export class CreateUserRequestDto extends PickType(BaseUserRequestDto, [
  'password',
  'email',
]) {}
