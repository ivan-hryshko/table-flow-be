import { JWT_SECRET } from "../../config";
import { ExpressRequest } from "../../types/expressRequest.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserService } from "../user.service";
import { throwError } from "rxjs";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null
      next()
      return
    }

    const bearer = req.headers.authorization.split(' ')[0]
    const token = req.headers.authorization.split(' ')[1]

    try {
      if (bearer !== 'Bearer') {
        throwError('Token don\'t valid')
      }
      const decode = verify(token, JWT_SECRET)
      const user = await this.userService.findById(decode.id)
      req.user = user
      next()
    } catch (error) {
      req.user = null
      next()
      return
    }
  }
}