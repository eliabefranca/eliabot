import { CommandData, CommandHandler, CommandType } from 'core/protocols';
import { getRandomInterval } from '../../utils/random';
import { Client } from 'genius-lyrics';

const handler: CommandHandler = async ({ client, message, value }) => {
  const prob = getRandomInterval(100);

  const genius = new Client();
  const songs = await genius.songs.search(value);
  const song = songs[0];
  if (!song?.id) {
    await client.sendMessage({
      chatId: message.chatId,
      text: 'Não encontrei essa música',
      quote: message,
    });
    return;
  }

  const lyrics = await await songs[0].lyrics();
  let caption = `${song.title} - ${song.artist.name}\n\n`;
  caption += lyrics;

  await client.sendMessage({
    chatId: message.chatId,
    image: { url: song.image, caption },
    quote: message,
  });
};

export default {
  keywords: ['.lyrics', '.letra'],
  category: CommandType.FUNNY,
  handler,
  description: 'Calcula a probabilidade de alguma coisa',
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
