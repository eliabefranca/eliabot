import { Bot } from './bot';
import { getTimeStamp } from './helpers/date';
import { blockedUsersDb, usersDb } from './main/db';

const bot = new Bot();
bot.start();
