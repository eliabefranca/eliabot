import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ client, message, value }) => {
  const prob = Math.floor(Math.random() * 101);

  await client.reply(message.from, `${prob}%`, message.id);
};

const prob: CommandData = {
  command: '.prob',
  func,
  description: 'Calcula a probabilidade de alguma coisa',
};

export default prob;
