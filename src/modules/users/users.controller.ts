import { NextFunction, Request, Response } from 'express';

import RegisterDto from './dto/register.dto';
import { TokenData } from '../auth';
import UserService from './users.service';

export default class UsersController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    console.log("OK")
    try {
      const model: RegisterDto = req.body;
      const tokenData: TokenData = await this.userService.createUser(model);
      res.status(201).json(tokenData);
    } catch (error) {
      next(error);
    }
  };
}