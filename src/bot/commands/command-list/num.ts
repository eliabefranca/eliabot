import { Command, CommandData, CommandType } from '@command-protocols';
import { getNumberFromContactId } from 'src/bot/utils/get-number-from-contact-id';
import { getUserIdFromMessage } from 'src/bot/utils/get-user-id-from-message';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';

const func: Command = async ({ message, client, value }) => {
  const userId = getUserIdFromMessage(message, value);

  if (!userId) {
    outputErrorMessage(
      client,
      message,
      'Você precisa me enviar a pessoa, ou marcar alguém.'
    );
  }

  const number = getNumberFromContactId(userId);

  client.reply(message.from, number, message.id);
};

const num: CommandData = {
  func,
  command: '.num',
  category: CommandType.UTILS,
  description:
    'Retorna o número de uma pessoa a partir de uma mensagem ou uma marcação',
  onlyForGroups: false,
};

export default num;
