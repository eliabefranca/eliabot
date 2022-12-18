import ytdl, { videoInfo } from 'ytdl-core';
const yts = require('yt-search');
import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import { isUrl } from 'utils/isUrl';
import { existsSync, writeFileSync } from 'fs';
import fs from 'fs';
import path from 'path';

const handler: CommandHandler = async ({ value, client, message }) => {
  try {
    if (typeof value !== 'string') {
      client.sendMessage({
        chatId: message.chatId,
        text: 'Você precisa enviar o link do vídeo ou um texto para a pesquisa',
        quote: message,
      });
      return;
    }

    let videoinfo: videoInfo | null = null;
    let videoUrl = value;
    if (!isUrl(value)) {
      const videos = await yts(value).catch(() => false);

      if (!videos || !videos.all || !videos.all[0]) {
        client.sendMessage({
          chatId: message.chatId,
          text: 'Não foi possível encontrar o vídeo [' + value + ']',
          quote: message,
        });
        return;
      }
      videoUrl = videos.all[0].url;
    }

    videoinfo = await ytdl.getInfo(videoUrl).catch(() => null);

    if (videoinfo === null) {
      client.sendMessage({
        chatId: message.chatId,
        text: 'Não foi possível encontrar o vídeo, verifique a *url* ou o *termo de pesquisa*.',
        quote: message,
      });
      return;
    }

    const MAX_BUFFER_SIZE = 1024 * 1024 * 15; // the max size that can be sent in a single message is 16MB

    const videoName = message.sender.id + '.mp4';
    const filePath = path.join(__dirname, '..', '..', '..', 'temp', videoName);

    if (existsSync(filePath)) {
      client.sendMessage({
        chatId: message.chatId,
        text: 'Você já está baixando um vídeo, aguarde o término do download.',
        quote: message,
      });
      return;
    }

    fs.writeFileSync(filePath, '');
    const deleteFile = () =>
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

    let streamDestroyed = false;
    const stream = ytdl(videoUrl, {
      quality: 'lowest',
      filter: 'audioandvideo',
    });
    stream.pipe(fs.createWriteStream(filePath));
    stream.on('error', (error) => {
      console.error(error);
      deleteFile();
    });

    stream.on('data', async () => {
      if (streamDestroyed) return;

      const bufferFromFile = fs.readFileSync(filePath);

      if (bufferFromFile.length > MAX_BUFFER_SIZE) {
        streamDestroyed = true;
        await client.sendMessage({
          chatId: message.chatId,
          text: 'O vídeo é muito grande, tente baixar um vídeo menor.',
          quote: message,
        });
        stream.unpipe();
        stream.destroy();
        deleteFile();
      }
    });

    stream.on('end', async () => {
      stream.destroy();
      await client.sendMessage({
        chatId: message.chatId,
        video: {
          buffer: fs.readFileSync(filePath),
          caption: videoinfo!.videoDetails.title,
        },
        quote: message,
      });
      deleteFile();
    });
  } catch (err) {
    console.error(err);
  }
  return;
};

export default {
  keywords: ['.ytdl', '.yd'],
  category: CommandType.MEDIA,
  description: 'Baixa um vídeo do youtube (Beta).',
  handler,
  hidden: true,
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
