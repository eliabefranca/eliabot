import google from 'googlethis';

import { CommandData, CommandHandler, CommandType } from 'core/protocols';

const lineBorder = '______________________________';

const handler: CommandHandler = async ({ client, message }) => {
  const { headline_stories } = await google.getTopNews('pt-br', 'br');

  let text = '\n\n';
  text += 'Últimas notícias:\n\n';

  for (const story of headline_stories) {
    const { title, url, by, published } = story;
    text += `*${title}*\n\n${url}`;

    if (by) {
      text += `\n\n${published} - ${by}`;
    }
    text += `\n\n${lineBorder}\n\n`;
  }

  await client.sendMessage({
    chatId: message.chatId,
    text,
    quote: message,
  });
};

const prob: CommandData = {
  keywords: ['.news', '.gnews'],
  category: CommandType.FUNNY,
  handler,
  description: 'Retorna as últimas notícias do Google News',
  allowInGroups: true,
  allowInPrivate: true,
};

export default prob;
