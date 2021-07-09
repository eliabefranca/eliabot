import { getNumberFromContactId } from '../../helpers/get-number-from-contact-id';
import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ message, client, value }) => {
  const adjective = value?.trim();

  if (!adjective) {
    client.reply(
      message.from,
      'Você precisa me enviar um adjetivo',
      message.id
    );
  }

  let groupMembers = await client.getGroupMembers(message.chat.id as any);
  const firstMember =
    groupMembers[Math.floor(Math.random() * groupMembers.length)];

  const contactNumber = getNumberFromContactId(firstMember.id);

  await client.sendTextWithMentions(
    message.from,
    `@${contactNumber} é a pessoa mais ${adjective} do grupo`
  );
};

const maisAlgumaCoisa: CommandData = {
  command: '.mais',
  description: 'Escolhe um membro aleatório do grupo. Requer um adjetivo.',
  onlyForGroups: true,
  func,
};

export default maisAlgumaCoisa;
