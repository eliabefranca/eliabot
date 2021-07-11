import { usersDb } from '../../../../database/json/db';
import { Command, CommandData } from '../../protocols/command';

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    await client.reply(
      message.from,
      'Você precisa marcar o usuário ou me enviar o número.',
      message.id
    );
  }

  const userId = value?.trim().replace('@', '').replace('+', '') + '@c.us';

  const user = usersDb.getFirst({ id: userId });

  if (!user) {
    await client.reply(message.from, 'Usuário não encontrado.', message.id);
    return;
  }

  usersDb.update(user, { role: '' });

  await client.reply(
    message.from,
    'O usuário fornecido não é mais um moderador.',
    message.id
  );
};

const demote: CommandData = {
  func,
  description: '',
  command: '.demote',
  allowedUsers: 'admin',
  hidden: true,
};

export default demote;
