import google from 'googlethis';

import { CommandData, CommandHandler, CommandType } from 'core/protocols';

const formatter = '```';
const lineBorder = '______________________________';

const handler: CommandHandler = async ({ client, message, value, params }) => {
  const pageParam =
    params.filter((p) => p.startsWith('p'))[0]?.replace('p', '') ?? '1';
  const page = parseInt(pageParam, 10);

  const { results } = await google.search(value, { page });

  let text = '';
  text += `Resultados da página *${page}*:\n\n`;

  for (const result of results) {
    const { title, url, description, is_sponsored } = result;
    text += `*${title}*\n\n${formatter}${description}${formatter}\n\n${url}`;
    text += is_sponsored ? '\n\n*Anúncio*' : '';
    text += `\n\n${lineBorder}`;
    text += '\n';
  }

  await client.sendMessage({
    chatId: message.chatId,
    text,
    quote: message,
  });
};

const prob: CommandData = {
  keywords: ['.google', '.gs'],
  category: CommandType.FUNNY,
  handler,
  description: 'Pesquisa no Google - .google <termo> #p<número da página>',
  allowInGroups: true,
  allowInPrivate: true,
};

export default prob;
