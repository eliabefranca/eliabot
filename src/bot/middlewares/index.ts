import { Bot } from '../bot';
import {
  checkIfGroupBlocked,
  checkIfUserIsAdmin,
  checkIfUserBlocked,
  checkIfUserIsModerator,
} from './command-middlewares';

const commandMidlewares = [
  checkIfGroupBlocked,
  checkIfUserIsAdmin,
  checkIfUserBlocked,
  checkIfUserIsModerator,
];

export function setupMiddlewares(bot: Bot) {
  commandMidlewares.forEach((middleware) => bot.useMiddleware(middleware));
}
