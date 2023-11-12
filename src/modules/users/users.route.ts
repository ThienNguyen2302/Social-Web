import RegisterDto from './dto/register.dto';
import { Route } from '../../core/interfaces';
import { Router } from 'express';
import UsersController from './users.controller';
import validationMiddleware from '../../core/middlewares/validation.middleware';

export default class UsersRoute implements Route {
  public path = '/api/users';
  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(RegisterDto , false),
      this.usersController.register
    ); //POST: http://localhost:3000/api/users

    this.router.get(this.path, (req, res) =>{
      console.log(req.body)
      res.send("OK")
    })
  }
}