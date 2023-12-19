import { PartialType, PickType } from '@nestjs/swagger';

import { BaseUserRequestDto } from './base-user.request.dto';

export class UpdateUserRequestDto extends PartialType(
  PickType(BaseUserRequestDto, [
    'firstName',
    'lastName',
    'email',
    'password',
    'bio',
    'image',
  ]),
) {}
