import google from 'googlethis';

import { CommandData, CommandHandler, CommandType } from 'core/protocols';

const formatter = '```';
const lineBorder = '______________________________';

const handler: CommandHandler = async ({ client, message, value, params }) => {
  const pageParam =
    params.filter((p) => p.startsWith('p'))[0]?.replace('p', '') ?? '1';
  const page = parseInt(pageParam, 10);

  const { results, dictionary, did_you_mean, knowledge_panel } =
    await google.search(value, {
      page,
    });

  let text = '';

  if (did_you_mean) {
    text += `Você quis dizer: *${did_you_mean}*?\n\n`;
  }

  text += `Resultados da página *${page}*:\n\n`;

  if (knowledge_panel.title && knowledge_panel.description) {
    text += `*${knowledge_panel.title}*\n\n${formatter}${knowledge_panel.description}${formatter}\n\n${knowledge_panel.url}\n\n${lineBorder}\n\n`;
  }

  for (const definition of dictionary.definitions) {
    text += `${definition}\n\n`;
  }

  for (const example of dictionary.examples) {
    text += `${example}\n\n`;
  }

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
