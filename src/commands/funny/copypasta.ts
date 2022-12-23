import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import { getRandomCopyPasta } from 'lib/copypasta';

const handler: CommandHandler = async ({ client, message }) => {
  const text = await getRandomCopyPasta();

  await client.sendMessage({
    chatId: message.chatId,
    text,
    quote: message,
  });
};

export default {
  keywords: ['.copypasta'],
  category: CommandType.FUNNY,
  handler,
  description:
    'Retorna uma copypasta aleatória do site copypasta-br.fandom.com.',
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
