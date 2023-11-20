import { Request } from 'express';

import { UserEntity } from '../../modules/user/user.entity';

export interface ExpressRequest extends Request {
  user?: UserEntity;
  headers: { authorization: string };
}
