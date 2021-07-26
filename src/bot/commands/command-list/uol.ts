import { getUolNewsFromFrontPage } from 'get-news';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';
import { Command, CommandData, CommandType } from '@command-protocols';

const func: Command = async ({ client, message }) => {
  client.reply(message.from, 'Tô indo buscar o jornal 📭', message.id);

  const news = await getUolNewsFromFrontPage();

  if (!news) {
    outputErrorMessage(
      client,
      message,
      'Não consegui encontrar nenhuma notícia 😥'
    );
    return;
  }

  for (const item of news) {
    const { img, link, resumed, title } = item;
    if (img) {
      client.sendImage(
        message.from,
        img,
        item.title,
        `${title}\n${link}\n\n${resumed}`
      );
    } else {
      client.reply(message.from, `${item.title}\n${item.link}\n\n`, message.id);
    }
  }
};

const uol: CommandData = {
  command: ['.uol'],
  category: CommandType.UTILS,
  description: 'Retorna uma lista de notícias do site https://www.uol.com.br/',
  func,
  onlyForGroups: false,
  hidden: false,
};

export default uol;
