import { Bot } from './bot';
import { setupMiddlewares } from './middlewares';

const bot = new Bot();
setupMiddlewares(bot);
bot.start();
