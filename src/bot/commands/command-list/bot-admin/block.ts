import { blockedUsersDb, usersDb, userStatsDb } from '@json-db';
import { getTimeStamp } from '@utils';
import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '@bot-utils/output-error-message';
import { getUserIdFromMessage } from '@bot-utils/get-user-id-from-message';

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa marcar o usuário ou me enviar o número.'
    );
    return;
  }

  const userId = getUserIdFromMessage(message, value);
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

  const rank = await userStatsDb.getFirst({ id: userId });

  if (!rank) {
    outputErrorMessage(
      client,
      message,
      'O usuário informado não está no ranking.'
    );
    return;
  }

  userStatsDb.update(rank, { ...rank, commands: 0 });

  client.reply(
    message.from,
    'Os status para o usuário foram resetados.',
    message.id
  );
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
