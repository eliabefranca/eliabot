import { blockedUsersDb, usersDb } from '../../../../database/json/db';
import { getTimeStamp } from '../../../../helpers/date';
import { Command, CommandData } from '../../protocols/command';

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    await client.reply(
      message.from,
      'Você precisa marcar o usuário ou me enviar o número',
      message.id
    );
  }

  const userId = value?.trim().replace('@', '').replace('+', '') + '@c.us';
  const blockedUser = blockedUsersDb.getFirst({ userId: userId });

  if (blockedUser) {
    const user = await usersDb.getFirst({ id: blockedUser.userId });

    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      await client.reply(
        message.from,
        'Não é possível bloquear administradores e moderadores.',
        message.id
      );
      return;
    }

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
};

const block: CommandData = {
  func,
  description: '',
  command: '.block',
  allowedUsers: ['admin', 'moderator'],
  hidden: true,
};

export default block;
