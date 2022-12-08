import { Bot } from './bot';
import { setupMiddlewares } from './middlewares';

require('dotenv').config();

const bot = new Bot();
setupMiddlewares(bot);
bot.start();
