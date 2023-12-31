import { Route } from './core/interfaces';
import { Logger } from './core/utils';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import morgan from 'morgan';
import 'dotenv/config'
import { errorMiddleware } from './core/middlewares';

class App {
  public app: express.Application;
  public port: string | number;
  public production: Boolean;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.production = process.env.NODE_ENV === 'production' ? true : false;

    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeErrorMiddleware();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`Server is listening on port ${this.port}`);
    });
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeMiddleware() {
    if (this.production) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan('combined'));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    }
    else {
      this.app.use(morgan('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  private connectToDatabase() {
    const connectString = process.env.MONGODB_URI;
    if (!connectString) {
      Logger.error('Connection string is invalid');
      return;
    }
    mongoose
      .connect(connectString)
      .catch((reason) => {
        Logger.error(reason);
      });
    Logger.info('Database connected...');
  }
}

export default App;