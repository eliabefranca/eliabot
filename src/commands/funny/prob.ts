import { Command, CommandData, CommandType } from '../../types/command';
import { getRandomInterval } from '../../utils/random';

const func: Command = async ({ client, messageInfo, value }) => {
  const prob = getRandomInterval(100);
  await client.sendMessage(
    messageInfo.key.remoteJid!,
    { text: `${prob}%` },
    { quoted: messageInfo }
  );
};

const prob: CommandData = {
  command: ['.prob'],
  category: CommandType.FUNNY,
  func,
  description: 'Calcula a probabilidade de alguma coisa',
  allowInGroups: true,
  allowInPrivate: true,
};

export default prob;
