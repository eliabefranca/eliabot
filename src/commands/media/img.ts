import { imageSearch } from 'utils/imageSearch';
import { CommandData, CommandHandler, CommandType } from 'core/protocols';

const handler: CommandHandler = async ({ value, client, message }) => {
  const { chatId } = message;

  if (!value) {
    client.sendMessage({
      chatId,
      text: 'Você precisa fornecer um termo de pesquisa',
      quote: message,
    });
    return;
  }

  const imgUrl = await imageSearch(value)
    .then((url) => url)
    .catch(() => {
      return null;
    });

  if (imgUrl === 'cant resolve') {
    client.sendMessage({
      chatId,
      text: 'Não foi possível carregar a imagem do servidor de origem',
      quote: message,
    });
    return;
  } else if (imgUrl === 'not found' || imgUrl === null) {
    client.sendMessage({
      chatId,
      text: 'Não encontrei nenhum resultado, tente alterar o index',
      quote: message,
    });
    return;
  }

  if (!imgUrl) {
    client.sendMessage({
      chatId,
      text: `Não encontrei nenhum resultado de imagem para "${value}"`,
      quote: message,
    });
    return;
  }

  client.sendMessage({
    chatId,
    image: { url: imgUrl as string },
    caption: imgUrl as string,
    quote: message,
  });
};

const searchImage: CommandData = {
  keywords: ['.img'],
  category: CommandType.MEDIA,
  handler,
  description: 'Retorna uma imagem a partir de um texto ou palavra.',
  detailedDescription:
    'Você pode escolher a posição do resultado com "#N" onde N é a posição da imagem.\nEx.: .img cachorro #3 -> Retorna o terceiro resultado da pesquisa para a palavra "cachorro"',

  allowInGroups: true,
  allowInPrivate: true,
};

export default searchImage;
