import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandomInterval } from '@utils';
import { WordleGame } from './game';

const func: Command = async ({ client, message, value }) => {
  const game = new WordleGame(message.sender.id);
  const word = value!.toLowerCase().trim();
  const { gameImage, message: caption } = await game.play(word);

  await client.sendImage(
    message.from,
    gameImage,
    'filename',
    `#w ${caption}`,
    message.id
  );
};

const prob: CommandData = {
  command: ['.w', '.wordle'],
  category: CommandType.GAMES,
  func,
  description:
    'Jogo de palavras, você pode apenas responder a mensagem com o seu palpite',
  allowInGroups: true,
  allowInPrivate: true,
};

export default prob;
