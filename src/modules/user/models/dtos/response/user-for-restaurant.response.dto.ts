import { PickType } from '@nestjs/swagger';

import { BaseUserResponseDto } from './base-user.response.dto';

export class UserForRestaurantResponseDto extends PickType(
  BaseUserResponseDto,
  ['id', 'firstName', 'lastName'],
) {}
