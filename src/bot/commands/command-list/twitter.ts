import { Command, CommandData } from '../protocols/command';
const twitterGetUrl = require("twitter-url-direct")
const imageDataURI = require('image-data-uri');

const func: Command = async (params) => {
  const { value, client, message } = params;

  if (!value) {
    await client.reply(
      message.from,
      '🖕 Tu precisa me passar o link 🖕',
      message.id
    );
    return;
  }

  let imgUrl = await twitterGetUrl(value)
  const imageName = imgUrl as string;

  const dataUri = await imageDataURI.encodeFromURL(imgUrl.download[0].url);
  await client.sendImage(
    message.from,
    dataUri,
    imageName,
    `Ta na mão meu fih, without scandal 😜`,
    message.id
  );

};

const twittar: CommandData = {
  command: '.twittar',
  category: 'media',
  description: 'Baixa o vídeo do tweet enviado.',
  func,
};

export default twittar;