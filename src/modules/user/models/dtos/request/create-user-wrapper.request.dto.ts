import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateUserRequestDto } from './create-user.request.dto';

export class CreateUserWrapperRequestDto {
  @ValidateNested({ each: true })
  @Type(() => CreateUserRequestDto)
  user: CreateUserRequestDto;
}
