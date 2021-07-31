import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage, getNumberFromContactId } from '@bot-utils';
import { getRandom } from '@utils';

const func: Command = async ({ message, client, value }) => {
  const adjective = value?.trim();

  if (!adjective) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa me enviar um adjetivo'
    );
    return;
  }

  let groupMembers = await client.getGroupMembers(message.chat.id as any);
  const member = getRandom(groupMembers);

  const contactNumber = getNumberFromContactId(member.id);

  await client.sendTextWithMentions(
    message.from,
    `@${contactNumber} é a pessoa mais ${adjective} do grupo`
  );
};

const maisAlgumaCoisa: CommandData = {
  command: ['.mais'],
  category: CommandType.FUNNY,
  description: 'Escolhe um membro aleatório do grupo. Requer um adjetivo',
  func,
  allowInGroups: true,
  allowInPrivate: false,
};

export default maisAlgumaCoisa;
