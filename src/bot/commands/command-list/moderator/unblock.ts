import { blockedUsersDb } from '@json-db';
import { Command, CommandData, CommandType } from '@command-protocols';

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    await client.reply(
      message.from,
      'Você precisa marcar o usuário ou me enviar o número.',
      message.id
    );
    return;
  }

  const userId = value?.trim().replace('@', '').replace('+', '') + '@c.us';
  const blockedUser = blockedUsersDb.getFirst({ userId: userId });

  if (blockedUser) {
    blockedUsersDb.delete(blockedUser);
    await client.reply(
      message.from,
      'Usuário desbloqueado com sucesso.',
      message.id
    );

    return;
  } else {
    await client.reply(
      message.from,
      'Este usuário não está bloqueado',
      message.id
    );
    return;
  }
};

const block: CommandData = {
  func,
  description: '',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.unblock'],
  allowedUsers: ['admin', 'moderator'],
  hidden: true,
  allowInGroups: true,
  allowInPrivate: true,
};

export default block;
