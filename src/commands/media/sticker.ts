import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import * as WSF from 'wa-sticker-tew';

const handler: CommandHandler = async ({ client, message }) => {
  let image = message.image;

  if (message.type === 'reply') {
    image = message.quoted?.image;
  }

  if (!image) {
    await client.sendMessage({
      chatId: message.chatId,
      text: 'Você precisa enviar uma imagem ou responder uma imagem',
      quote: message,
    });
    return;
  }

  const sticker = new WSF.Sticker(image, {
    pack: 'eliabot',
    author: 'eliabot',
    quality: 100,
  });
  await sticker.build();
  const sticBuffer = await sticker.get();

  client.sendMessage({
    chatId: message.chatId,
    sticker: sticBuffer,
    quote: message,
  });
};

const search: CommandData = {
  keywords: ['.fig', '.sticker', '.figurinha'],
  handler,
  category: CommandType.MEDIA,
  description: 'Cria uma figurinha a partir de uma imagem',
  detailedDescription: '',
  allowInGroups: true,
  allowInPrivate: true,
};

export default search;
