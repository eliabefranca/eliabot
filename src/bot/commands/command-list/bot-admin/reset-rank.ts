import { userStatsDb } from '@json-db';
import { Command, CommandData, CommandType } from '@command-protocols';
import { getUserIdFromMessage } from '@bot-utils/get-user-id-from-message';
import { outputErrorMessage } from '@bot-utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  const userId = getUserIdFromMessage(message, value);

  if (!userId) {
    outputErrorMessage(client, message, 'Você precisa me informar um usuário.');
    return;
  }

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

const stats: CommandData = {
  command: ['.resetranking', '.rr'],
  func,
  category: CommandType.BOT_ADMINISTRATION,
  description: 'Reseta o ranking de um usuário.',
  hidden: false,
  allowInGroups: true,
  allowInPrivate: true,
  allowedUsers: ['admin'],
};

export default stats;
