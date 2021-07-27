import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandomContactNumber } from '../../utils/get-random-contact-number';

const func: Command = async ({ client, message }) => {
  const contactNumber = await getRandomContactNumber(client, message);
  const text = `Filha : Mãe Quero Perder A Virgindade 😨
Mãe : Com Quem ? 👀
Filha : Com o @${contactNumber}
Mãe : Você Tá Louca Quer Perde A Virgindade Ou A Capacidade de Andar😨💔
taporra 🥴💥`;
  await client.sendTextWithMentions(message.from, text, message.id as any);
};

const virgindade: CommandData = {
  command: ['.virgindade'],
  category: CommandType.FUNNY,
  func,
  description: 'Descubra 😳',
  allowInGroups: true,
  allowInPrivate: false,
};

export default virgindade;
