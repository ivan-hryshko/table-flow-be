import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { throwError } from 'rxjs';

import { JWTConfig } from '../../../config/config.types';
import { ExpressRequest } from '../../../utils/types/expressRequest.interface';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    const jwtKey: JWTConfig = this.configService.get('jwt');

    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const bearer = req.headers.authorization.split(' ')[0];
    const token = req.headers.authorization.split(' ')[1];

    try {
      if (bearer !== 'Bearer') {
        throwError('Токен не дійсний');
      }
      const decode = verify(token, jwtKey.accessTokenSecret) as any;
      req.user = await this.userService.findById(decode.id);
      next();
    } catch (error) {
      req.user = null;
      next();
      return;
    }
  }
}
