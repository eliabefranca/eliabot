import { decryptMedia } from '@open-wa/wa-automate';
import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ value, client, message }) => {
  const quotedMessage = message.quotedMsg;

  if (quotedMessage && quotedMessage.mimetype) {
    let mediaData = await decryptMedia(quotedMessage);

    const imageBase64 = `data:${
      quotedMessage.mimetype
    };base64,${mediaData.toString('base64')}`;

    await client.sendImageAsSticker(message.from, imageBase64, {
      author: 'Eliabot',
      keepScale: true,
      pack: 'teucu',
      circle: value?.includes('circle'),
      removebg: value?.includes('removebg'),
    });
    await client.sendText(message.from, 'De nada.');
    // await client.sendText(message.from, quotedMessage.mimetype);
  } else {
    await client.reply(
      message.from,
      'Você precisa me enviar uma imagem, zé ruela.',
      message.id
    );
  }
};

const search: CommandData = {
  command: '.fig',
  func,
  description: 'Cria uma figurinha a partir de uma imagem',
};

export default search;
