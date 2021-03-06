import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandom } from '@utils';

const func: Command = async ({ client, message, value }) => {
  const fruits = ['๐', '๐', '๐', '๐', '๐'];
  const rounds = 5;

  let first = '';
  let second = '';
  let third = '';
  client.sendText(message.from, '๐ฐ Girando a roleta');
  for (let i = 0; i < rounds; i++) {
    first = getRandom(fruits);
    second = getRandom(fruits);
    third = getRandom(fruits);

    client.sendText(message.from, `${first} ${third} ${second}`);
  }

  if (first === second && second === third) {
    client.sendText(message.from, `๐ Parabรฉns, vocรช ganhou!`);
  } else {
    client.sendText(message.from, `๐ธ Vocรช perdeu!`);
  }
};

const jackpot: CommandData = {
  command: ['.jackpot'],
  category: CommandType.FUNNY,
  description: 'Joguinho de cassino ๐ฐ',
  func,
  allowInGroups: false,
  allowInPrivate: true,
  hidden: false,
};

export default jackpot;
