import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandomContactNumber } from '@bot-utils';

const func: Command = async ({ message, client, value }) => {
  const contactNumber = await getRandomContactNumber(client, message);

  await client.sendTextWithMentions(
    message.from,
    `quem ${value}: 😶👉 @${contactNumber}`
  );
};

const quem: CommandData = {
  func,
  command: ['.quem'],
  category: CommandType.FUNNY,
  description: 'Escolhe um membro aleatório do grupo como responsável',
  allowInGroups: true,
  allowInPrivate: false,
};

export default quem;
