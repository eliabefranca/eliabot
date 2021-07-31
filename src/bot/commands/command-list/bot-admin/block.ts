import { blockedUsersDb, usersDb } from '@json-db';
import { getTimeStamp } from '@utils';
import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '@bot-utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa marcar o usuário ou me enviar o número.'
    );
    return;
  }

  const userId = value?.trim().replace('@', '').replace('+', '') + '@c.us';
  const user = await usersDb.getFirst({ id: userId });

  if (user && (user.role === 'admin' || user.role === 'moderator')) {
    await outputErrorMessage(
      client,
      message,
      'Não é possível bloquear administradores e moderadores.'
    );
    return;
  }

  const blockedUser = blockedUsersDb.getFirst({ userId: userId });

  if (blockedUser) {
    blockedUsersDb.delete(blockedUser);
  }

  blockedUsersDb.save({
    userId,
    unblockDate: 'never',
    updated_at: getTimeStamp(),
    created_at: getTimeStamp(),
  });

  await client.reply(
    message.from,
    'Usuário bloqueado com sucesso.',
    message.id
  );
  return;
};

const block: CommandData = {
  func,
  description: '',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.block'],
  allowedUsers: ['admin', 'moderator'],
  hidden: true,
  allowInGroups: true,
  allowInPrivate: true,
};

export default block;
