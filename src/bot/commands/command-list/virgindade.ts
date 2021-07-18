import {Command, CommandData} from '../protocols/command';
import getContactNumber from "./utils/getContactNumber";

const func: Command = async ({ client, message }) => {
  const contactNumber = await getContactNumber(client, message);

  // await client.sendText(message.from, `😶👉 @${contactNumber1}`, message.id);

  await client.sendTextWithMentions(
    message.from,
    `Filha : Mae Quero Perder A Virgindade 😨
Mae : Com Quem ? 👀
Filha : Com o @${contactNumber}
Mãe : Você Tá Louca Quer Perde A Virgindade Ou A Capacidade de Andar😨💔
    
taporra 🥴💥`,
    message.id as any
  );
};

const virgindade: CommandData = {
  command: '.virgindade',
  func,
  description: 'Descubra 😳',
  onlyForGroups: true,
};

export default virgindade;
