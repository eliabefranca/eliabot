import { Command, CommandData, CommandType } from '@command-protocols';
import { validPerson } from '../../utils/valid-person';
import { getRandom } from '../../../helpers/get-random';

const func: Command = async ({ client, message, value }) => {
  const fruits = ['🍎', '🍌', '🍒', '🍉', '🍐'];
  const rounds = 5;

  let first = '';
  let second = '';
  let third = '';
  client.sendText(message.from, '🎰 Girando a roleta');
  for (let i = 0; i < rounds; i++) {
    first = getRandom(fruits);
    second = getRandom(fruits);
    third = getRandom(fruits);

    client.sendText(message.from, `${first} ${third} ${second}`);
  }

  if (first === second && second === third) {
    client.sendText(message.from, `🎉 Parabéns, você ganhou!`);
  } else {
    client.sendText(message.from, `💸 Você perdeu!`);
  }
};

const jackpot: CommandData = {
  command: ['.jackpot'],
  category: CommandType.FUNNY,
  description: 'Joguinho de cassino 🎰',
  func,
  allowInGroups: false,
  allowInPrivate: true,
  hidden: false,
};

export default jackpot;
