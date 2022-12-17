import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import { getRandomInterval } from '../../utils/random';

const handler: CommandHandler = async ({ client, message, value }) => {
  const prob = getRandomInterval(100);

  await client.sendMessage({
    chatId: message.chatId,
    text: `${prob}%`,
    quote: message,
  });
};

const prob: CommandData = {
  keywords: ['.prob'],
  category: CommandType.FUNNY,
  handler,
  description: 'Calcula a probabilidade de alguma coisa',
  allowInGroups: true,
  allowInPrivate: true,
};

export default prob;
