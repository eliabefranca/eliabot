import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandomInterval } from '@utils';
import { WordleGame } from './game';

const func: Command = async ({ client, message, value }) => {
  const game = new WordleGame(message.sender.id);
  const word = value!;
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
  command: ['.w'],
  category: CommandType.FUNNY,
  func,
  description: 'Jogo wordle',
  allowInGroups: true,
  allowInPrivate: true,
  hidden: true,
};

export default prob;
