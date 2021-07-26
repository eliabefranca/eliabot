import { Command, CommandData, CommandType } from '@command-protocols';
import { CONFIG } from 'config';
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
  description: 'Mostra um print da janela',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.alert', '.al'],
  allowedUsers: 'admin',
};

export default alert;
