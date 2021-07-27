import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';
import { getRandom } from '../../../helpers/get-random';

const papers = '🖐,✋,🤚,🖖,paper';
const rocks = '🤜,rock,pedra,👊,🤛';
const scissors = '✂️,tesoura,scissors,✌️';

type Hands = 'paper' | 'rock' | 'scissors';
interface Result {
  wins: string;
  loses: string;
  draws: string;
}
interface HandsResults {
  rock: Result;
  paper: Result;
  scissors: Result;
}
const getHand = (str: string | undefined): Hands | null => {
  if (!str) {
    return null;
  }

  if (papers.indexOf(str) !== -1) {
    return 'paper';
  }

  if (rocks.indexOf(str) !== -1) {
    return 'rock';
  }

  if (scissors.indexOf(str) !== -1) {
    return 'scissors';
  }

  return null;
};

const func: Command = async ({ client, message, value }) => {
  const playerHand = getHand(value ?? '');
  if (!playerHand) {
    outputErrorMessage(
      client,
      message,
      'Você tem que falar se quer pedra, papel ou tesoura 😐\n\nSe precisar de ajuda para jogar, digite ".help .jokenpo" (sem as aspas).'
    );
    return;
  }

  const results: HandsResults = {
    rock: {
      wins: 'scissors',
      loses: 'paper',
      draws: 'rock',
    },
    paper: {
      wins: 'rock',
      loses: 'scissors',
      draws: 'paper',
    },
    scissors: {
      wins: 'paper',
      loses: 'rock',
      draws: 'scissors',
    },
  };

  const formattedHands = {
    paper: '🖐',
    rock: '🤜',
    scissors: '✌️',
  };

  const computerHand = getRandom(
    Object.keys(results)
  ) as keyof typeof formattedHands;
  if (results[playerHand].wins === computerHand) {
    client.reply(
      message.from,
      `${formattedHands[computerHand]}!\n${formattedHands[playerHand]} ganha de ${formattedHands[computerHand]},infelizmente eu perdi 😞`,
      message.id
    );
  } else if (results[playerHand].loses === computerHand) {
    client.reply(
      message.from,
      `${formattedHands[computerHand]}!\n${formattedHands[computerHand]} ganha de ${formattedHands[playerHand]}, acho que eu ganhei 😜`,
      message.id
    );
  } else {
    client.reply(message.from, 'Aí deu empate, meu patrão 😐', message.id);
  }
};

const formatHandOptions = (handOpt: string) => {
  return handOpt
    .split(',')
    .map((opt) => `"${opt.trim()}"`)
    .filter((opt) => opt !== '')
    .join(',');
};

let handOptions = `pedra: ${formatHandOptions(rocks)}\n\n`;
handOptions += `papel: ${formatHandOptions(papers)}\n\n`;
handOptions += `tesoura: ${formatHandOptions(scissors)}\n\n`;

const jackpot: CommandData = {
  command: ['.jokenpo', '.jkp'],
  category: CommandType.FUNNY,
  description: 'Pedra, papel ou tesoura',
  detailedDescription: `Opções válidas:\n\n${handOptions}`,
  func,
  allowInGroups: true,
  allowInPrivate: true,
  hidden: false,
};

export default jackpot;
