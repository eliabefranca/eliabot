import { blockedUsersDb } from '../../../database/json/db';
import { CommandMiddleware } from '../../bot';

export const checkIfUserBlocked: CommandMiddleware = async ({
  client,
  message,
}): Promise<boolean> => {
  const blockedUser = blockedUsersDb.getFirst({ userId: message.sender.id });

  if (blockedUser) {
    await client.reply(message.from, 'Usuário bloqueado.', message.id);
    return false;
  }

  return true;
};
