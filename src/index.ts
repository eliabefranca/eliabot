import { API } from './api';
import { Bot } from './bot/bot';
import { setupMiddlewares } from './bot/middlewares';

require('dotenv').config();

const bot = new Bot();
setupMiddlewares(bot);
bot.start();

API.start();
