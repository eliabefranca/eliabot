import { Bot } from './bot';
import { getCommands } from './commands/command-list';
import { getTimeStamp } from './helpers/date';
import { blockedUsersDb, usersDb } from './main/db';

const bot = new Bot();
bot.start();

getCommands();
