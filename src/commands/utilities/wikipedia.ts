import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import wiki from 'wikipedia';

const handler: CommandHandler = async ({ client, message, value }) => {
  if (!value) {
    await client.sendMessage({
      chatId: message.chatId,
      text: 'Você precisa informar um termo para pesquisar',
      quote: message,
    });
    return;
  }

  try {
    await wiki.setLang('pt');
    const page = await wiki.page(value);
    const summary = await page.summary();

    let text = '';
    text += `*${summary.title}*\n\n`;
    text += `${summary.description}`;
    text += `\n\n${summary.extract}`;
    text += `\n\n${page.fullurl}`;

    await client.sendMessage({
      chatId: message.chatId,
      image: { url: summary.thumbnail.source, caption: text },
      quote: message,
    });
  } catch (error) {
    console.error(error);
    await client.sendMessage({
      chatId: message.chatId,
      text: 'Não foi possível encontrar a página',
      quote: message,
    });
  }
};

export default {
  keywords: ['.wiki', '.wikipedia'],
  category: CommandType.FUNNY,
  handler,
  description: 'Retorna o resultado da pesquisa no Wikipedia - .wiki <termo>',
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
