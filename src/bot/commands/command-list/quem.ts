import { Command, CommandData } from '../protocols/command';
import getRandomContactNumber from "./utils/getContactNumber";

const func: Command = async ({ message, client, value }) => {
  const contactNumber = getRandomContactNumber(client, message)

  await client.sendTextWithMentions(
    message.from,
    `quem ${value}: 😶👉 @${contactNumber}`,
    message.id as any
  );
};

const quem: CommandData = {
  func,
  command: '.quem',
  description: 'Escolhe um membro aleatório do grupo como responsável',
  onlyForGroups: true,
};

export default quem;
