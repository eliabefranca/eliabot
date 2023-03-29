import path from 'path';
import { createSticker } from 'wa-sticker';
import { fromBuffer } from 'file-type';
import { unlinkSync, writeFileSync } from 'fs';
import { CommandData, CommandHandler, CommandType } from 'core/protocols';

const handler: CommandHandler = async ({ client, message }) => {
  let image = message.image;
  let video = message.video;

  if (message.type === 'reply') {
    image = message.quoted?.image;
    video = message.quoted?.video;
  }

  if (!image && !video) {
    await client.sendMessage({
      chatId: message.chatId,
      text: 'Você precisa enviar ou responder uma imagem',
      quote: message,
    });
    return;
  }

  const fileType = await fromBuffer(video ?? image!);

  const filePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'temp',
    `${message.sender.id}.${fileType?.ext}`
  );

  const fileToBeCreated = (image ?? video) as Buffer;
  await writeFileSync(filePath, fileToBeCreated);

  const sticker = await createSticker([filePath], {
    quality: 100,
    crop: false,
    metadata: {
      publisher: 'eliabot',
      packname: 'eliabot',
    },
  });

  try {
    unlinkSync(filePath);
  } catch (error) {
    console.error(error);
  }

  client.sendMessage({
    chatId: message.chatId,
    sticker,
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
