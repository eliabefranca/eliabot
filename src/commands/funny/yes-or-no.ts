import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import { getRandom } from 'utils/random';

const handler: CommandHandler = async (params) => {
  const { client, message } = params;
  const answers = ['Sim.', 'Não.', 'Talvez.'];
  const answer = getRandom(answers);

  await client.sendMessage({
    chatId: message.chatId,
    text: answer,
    quote: message,
  });
};

export default {
  keywords: ['.p'],
  category: CommandType.FUNNY,
  description: 'Responde sim, não ou talvez',
  handler,
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
