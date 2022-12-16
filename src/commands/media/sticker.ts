import { downloadMediaMessage } from '@adiwajshing/baileys';
import * as WSF from 'wa-sticker-tew';
import { logger } from 'src';
import { Command, CommandData, CommandType } from 'src/types/command';
import { getQuotedMessage } from 'src/helpers/getQuotedMessage';

const func: Command = async ({ value, client, messageInfo, fromQuoted }) => {
  let messageToBeDownloaded = Object.assign({}, messageInfo);

  if (fromQuoted) {
    const message = getQuotedMessage(messageInfo);
    messageToBeDownloaded = Object.assign({}, messageInfo, { message });
  }

  const buffer = (await downloadMediaMessage(
    messageToBeDownloaded,
    'buffer',
    {},
    {
      logger,
      // pass this so that baileys can request a reupload of media
      // that has been deleted
      reuploadRequest: client.updateMediaMessage,
    }
  )) as Buffer;

  const sticker = new WSF.Sticker(buffer, {
    pack: 'eliabot',
    author: 'eliabot',
    quality: 100,
  });
  await sticker.build();
  const sticBuffer = await sticker.get();

  client.sendMessage(
    messageInfo.key.remoteJid!,
    { sticker: sticBuffer },
    { quoted: messageInfo }
  );
};

const search: CommandData = {
  command: ['.fig', '.sticker', '.figurinha'],
  func,
  category: CommandType.MEDIA,
  description: 'Cria uma figurinha a partir de uma imagem',
  detailedDescription: '',
  allowInGroups: true,
  allowInPrivate: true,
};

export default search;
