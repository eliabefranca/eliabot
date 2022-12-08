import { getUolNewsFromFrontPage } from 'get-news';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';
import { Command, CommandData, CommandType } from '@command-protocols';
import { watch } from './watch';

// world cup!
const func: Command = async ({ client, message, value }) => {
  client.reply(message.from, 'Acompanhando o jogo...', message.id);

  if (!value) {
    await outputErrorMessage(client, message, 'Você precisa me enviar a url');
    return;
  }

  watch(value, client, message).catch((err) => console.log(err));
  return;
};

const wc: CommandData = {
  command: ['.wc'],
  category: CommandType.UTILS,
  description: 'Acompanha um jogo da copa do mundo',
  func,
  allowInGroups: false,
  allowInPrivate: true,
  allowedUsers: 'admin',
};

export default wc;
