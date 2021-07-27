import { Bot } from '../bot';
import {
  checkIfGroupBlocked,
  checkIfUserIsAdmin,
  checkIfUserBlocked,
  checkIfUserIsModerator,
  logUserOnConsole,
} from './command-middlewares';

const commandMidlewares = [
  checkIfGroupBlocked,
  checkIfUserIsAdmin,
  checkIfUserBlocked,
  checkIfUserIsModerator,
  logUserOnConsole,
];

export function setupMiddlewares(bot: Bot) {
  commandMidlewares.forEach((middleware) => bot.useMiddleware(middleware));
}
