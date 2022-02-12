import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandomInterval } from '@utils';

const func: Command = async ({ client, message, value }) => {
  const prob = getRandomInterval(100);
  await client.reply(message.from, `${prob}%`, message.id);
};

const prob: CommandData = {
  command: ['.w'],
  category: CommandType.FUNNY,
  func,
  description: 'Jogo wordle',
  allowInGroups: true,
  allowInPrivate: true,
  hidden: true,
};

export default prob;
