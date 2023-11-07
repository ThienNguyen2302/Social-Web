import { MainRoute } from './modules/main';
import App from './app';
import { validateEnv } from './core/utils';

validateEnv();

const routes = [new MainRoute()];

const app = new App(routes);

app.listen();