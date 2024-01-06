import { PickType } from '@nestjs/swagger';

import { BaseUserResponseDto } from './base-user.response.dto';

export class UserResponseDto extends PickType(BaseUserResponseDto, [
  'id',
  'firstName',
  'lastName',
  'email',
  'bio',
  'image',
]) {
  token: string;
}
