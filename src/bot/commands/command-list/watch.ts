import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '../../utils/output-error-message';
const yts = require('yt-search');

const func: Command = async (params) => {
  const { value, client, message } = params;

  const videos = await yts(value).catch(() => false);

  if (!videos || !videos.all || !videos.all[0]) {
    await outputErrorMessage(
      client,
      message,
      'Não foi possível encontrar o vídeo [' + value + ']'
    );
    return;
  }

  await client.sendYoutubeLink(
    message.from,
    videos.all[0].url,
    `Resultado da pesquisa para "${value}"`
  );
};

const watch: CommandData = {
  command: ['.watch'],
  category: CommandType.MEDIA,
  description: 'Pesquisa um vídeo no youtube',
  func,
};

export default watch;
