import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  if (!value?.trim()) {
    outputErrorMessage(
      client,
      message,
      'Envie a mensagem que deseja transmitir.'
    );
    return;
  }

  const chatIds = await client.getAllChatIds();

  for (const chatId of chatIds) {
    client.sendText(chatId, `[Mensagem de Transmissão]\n\n${value}`);
  }
};

const alert: CommandData = {
  func,
  description: 'Envia uma mensagem para todos os chats abertos no bot.',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.alert', '.al'],
  allowedUsers: 'admin',
  allowInGroups: true,
  allowInPrivate: true,
};

export default alert;
