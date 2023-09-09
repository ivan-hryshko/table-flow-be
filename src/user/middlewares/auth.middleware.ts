import { JWT_SECRET } from "@app/config";
import { ExpressRequest } from "@app/types/expressRequest.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    const nullifyUser = () => {
      req.user = null
      next()
      return
    }

    if (!req.headers.authorization) {
      nullifyUser()
    }

    const tokenString = req.headers.authorization.split(' ')
    const bearer = tokenString[0]

    if (bearer !== 'Bearer') {
      nullifyUser()
    }
    const token = tokenString[1]

    try {
      const decode = verify(token, JWT_SECRET)
      const user = await this.userService.findById(decode.id)
      req.user = user
      next()
    } catch (error) {
      nullifyUser()
    }
  }
}