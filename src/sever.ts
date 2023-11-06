import { MainRoute } from './modules/main';
import App from './app';


const routes = [new MainRoute()];

const app = new App(routes);

app.listen();