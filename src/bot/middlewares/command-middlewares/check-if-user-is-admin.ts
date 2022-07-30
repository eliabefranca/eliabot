import { usersDb } from '@json-db';
import { CommandMiddleware } from '../../bot';

export const checkIfUserIsAdmin: CommandMiddleware = async ({
  commandData,
  client,
  message,
  query,
}): Promise<boolean> => {
  const { allowedUsers } = commandData;

  if (!allowedUsers) {
    return true;
  }

  const user = usersDb.getFirst({ id: message.sender.id });

  const commandOnlyForAdmins =
    typeof allowedUsers === 'string'
      ? allowedUsers === 'admin'
      : allowedUsers instanceof Array &&
        allowedUsers.length === 1 &&
        allowedUsers.includes('admin');

  if (commandOnlyForAdmins) {
    if (user?.role === 'admin') {
      return true;
    }

    client.reply(
      message.from,
      'Este comando é apenas para administradores do bot.',
      message.id
    );
    return false;
  }

  return true;
};
