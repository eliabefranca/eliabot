import { decryptMedia, Message } from '@open-wa/wa-automate';
import { Command, CommandData, CommandType } from '@command-protocols';

const func: Command = async ({ value, client, message }) => {
  let mediaMsg: Message = message;

  console.log('Creating sticker for ' + message.sender.pushname);

  const quotedMessage = message.quotedMsg;
  if (quotedMessage) {
    mediaMsg = quotedMessage;
  }

  if (mediaMsg.mimetype) {
    const mediaData = await decryptMedia(mediaMsg);

    const imageBase64 = `data:${mediaMsg.mimetype};base64,${mediaData.toString(
      'base64'
    )}`;

    if (mediaMsg.mimetype.includes('mp4')) {
      await client.sendMp4AsSticker(
        message.from,
        imageBase64,
        {},
        {
          author: 'Eliabot',
          keepScale: true,
          pack: 'teucu',
          circle: value?.includes('circle'),
          removebg: value?.includes('removebg'),
        }
      );
    } else {
      await client.sendImageAsSticker(message.from, imageBase64, {
        author: 'Eliabot',
        keepScale: true,
        pack: 'teucu',
        circle: value?.includes('circle'),
        removebg: value?.includes('removebg'),
      });
    }

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
  category: CommandType.UTILS,
  description: 'Cria uma figurinha a partir de uma imagem',
};

export default search;
