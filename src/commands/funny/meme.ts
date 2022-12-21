import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import memeGenerator from 'lib/memeGenerator';

const handler: CommandHandler = async ({ client, message, value }) => {
  const image = message.image ?? message.quoted?.image;

  const [top, bottom] = value.split('_');

  if (!image || !top || !bottom) {
    return client.sendMessage({
      chatId: message.chatId,
      text: 'Você precisa enviar uma imagem e duas frases separadas por "/"',
      quote: message,
    });
  }

  const memeImage = memeGenerator(image, top, bottom);

  return client.sendMessage({
    chatId: message.chatId,
    image: {
      buffer: memeImage,
    },
    quote: message,
  });
};

export default {
  keywords: ['.meme'],
  category: CommandType.FUNNY,
  handler,
  description:
    '(Beta) Cria a partir de uma imagem e duas frases .meme <imagem> <frase1>/<frase2>',
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
