import { usersDb } from '@json-db';
import { CommandMiddleware } from '../../bot';

export const checkIfUserIsModerator: CommandMiddleware = async ({
  commandData,
  client,
  message,
  query,
}): Promise<boolean> => {
  if (!commandData.allowedUsers) {
    return true;
  }

  if (commandData.allowedUsers.includes('moderator')) {
    const user = usersDb.getFirst({ id: message.sender.id });

    if (user?.role === 'admin' || user?.role === 'moderator') {
      return true;
    }

    await client.reply(
      message.from,
      'Este comando é apenas para moderadores e administradores do bot.',
      message.id
    );
    return false;
  }

  return true;
};
