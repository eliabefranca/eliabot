import fs from 'fs';
import ytdl, { videoInfo } from 'ytdl-core';
const yts = require('yt-search');

import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '@bot-utils/output-error-message';
import { isUrl } from 'src/utils/is-url';
import { CONFIG } from 'config';
import { getNumberFromContactId } from '@bot-utils/get-number-from-contact-id';

const func: Command = async (params) => {
  const { value, client, message } = params;

  if (typeof value !== 'string') {
    outputErrorMessage(
      client,
      message,
      'Você precisa enviar o link do vídeo ou um texto para a pesquisa'
    );
    return;
  }

  let videoinfo: videoInfo | null = null;
  let videoUrl = value;
  if (!isUrl(value)) {
    const videos = await yts(value).catch(() => false);

    if (!videos || !videos.all || !videos.all[0]) {
      await outputErrorMessage(
        client,
        message,
        'Não foi possível encontrar o vídeo [' + value + ']'
      );
      return;
    }
    videoUrl = videos.all[0].url;
  }

  videoinfo = await ytdl.getInfo(videoUrl).catch(() => null);

  if (!videoinfo) {
    outputErrorMessage(
      client,
      message,
      'Não foi possível encontrar o vídeo, verifique a *url* ou o *termo de pesquisa*.'
    );
    return;
  }

  await client.reply(
    message.from,
    `Estou baixando o vídeo "${videoinfo.videoDetails.title}", aguarde.`,
    message.id
  );

  const videoName = getNumberFromContactId(message.sender.id) + '.mp4';
  const videoDowloadLocation = CONFIG.videoDownloadsFolder + '/' + videoName;

  ytdl(videoUrl).pipe(
    fs.createWriteStream(videoDowloadLocation, { encoding: 'base64url' })
  );

  const base64 =
    `data:video/mp4;base64,` +
    fs.readFileSync(videoDowloadLocation, {
      encoding: 'base64',
    });

  await client.sendImage(
    message.from,
    base64,
    videoName,
    videoinfo.videoDetails.title,
    message.id
  );
};

const watch: CommandData = {
  command: ['.ytdl', '.yd'],
  category: CommandType.MEDIA,
  description: 'Baixa um vídeo do youtube (Beta).',
  func,
  hidden: true,
  allowInGroups: true,
  allowInPrivate: true,
};

export default watch;
