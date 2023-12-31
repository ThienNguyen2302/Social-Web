import { NextFunction, Request, Response } from 'express';
import { TokenData } from ".";
import AuthService from "./auth.service";
import LoginDto from "./dto/login.dto";

export default class AuthController {
    private authService = new AuthService();
  
    public login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const model: LoginDto = req.body;
        const tokenData: TokenData = await this.authService.login(model);
        res.status(200).json(tokenData);
      } catch (error) {
        next(error);
      }
    };
  }