import { Command, CommandData, CommandType } from '../protocols';
import { getRandomInterval } from '../../utils/get-random-interval';

const func: Command = async ({ client, message, value }) => {
  const prob = getRandomInterval(100);
  await client.reply(message.from, `${prob}%`, message.id);
};

const prob: CommandData = {
  command: '.prob',
  category: CommandType.FUNNY,
  func,
  description: 'Calcula a probabilidade de alguma coisa',
};

export default prob;
