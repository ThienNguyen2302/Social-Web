import { MainRoute } from './modules/main';
import App from './app';
import { validateEnv } from './core/utils';
import { UsersRoute } from './modules/users';
import { AuthRoute } from './modules/auth';

validateEnv();

const routes = [new MainRoute(), new UsersRoute(), new AuthRoute()];

const app = new App(routes);

app.listen();
