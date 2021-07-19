import { Command, CommandData, CommandType } from '@command-protocols';
import { validPerson } from '../../utils/valid-person';

const MAX_SIZE = 30;
const MIN_SIZE = 1;

function ascIISum(personName: String): number {
  let sum = 0;
  for (let i = 0; i < personName.length; ++i) {
    sum += personName.charCodeAt(i);
  }
  return sum;
}

function getValidSize(size: number): number {
  return size < MIN_SIZE ? MIN_SIZE : size > MAX_SIZE ? MAX_SIZE : size;
}

function calculateSizePipiu(personName: string): number {
  const sum = ascIISum(personName);
  const size = Math.floor((sum % 100) / 2);
  return getValidSize(size);
}

function getPipiu(sizePiupiu: number): string {
  return '8' + '='.repeat(Math.floor(sizePiupiu) / 2) + 'D';
}

const func: Command = async ({ client, message, value }) => {
  const personToCalculateSize = await validPerson(
    client,
    message,
    value,
    'Você precisa me informar o nome de quem quer saber o tamanho do piupiu'
  );
  if (personToCalculateSize != null) {
    const sizePiupiu = calculateSizePipiu(personToCalculateSize.slice(1));
    const piupiu = getPipiu(sizePiupiu);
    const msg = `O ${personToCalculateSize} me contou que o tamanho do piupiu dele é de ${sizePiupiu}cm\n${piupiu}`;
    await client.sendTextWithMentions(message.from, msg);
  }
};

const size: CommandData = {
  command: '.size',
  category: CommandType.FUNNY,
  description: 'Descubra o tamanho do piupiu de alguém',
  func,
  onlyForGroups: true,
  // hidden: true,
};

export default size;
