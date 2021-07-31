import { Command, CommandData, CommandType } from '@command-protocols';
import { getContactName } from 'src/bot/helpers/get-contact-name';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  let msg = '';

  if (!value) {
    outputErrorMessage(client, message, 'Você precisa fornecer um id.');
    return;
  }

  const groups = await client.getAllGroups();
  const targetGroup = groups.filter(
    (group) => group.id === value || group.name === value
  )[0];

  if (!targetGroup) {
    outputErrorMessage(client, message, 'Nenhum grupo encontrado.');
    return;
  }

  const { participants } = targetGroup.groupMetadata;
  msg += `${targetGroup.name} - ${targetGroup.id}\n\n\nParticipantes:\n\n`;
  for (const participant of participants) {
    const contact = await client.getContact(participant.id._serialized);
    if (!contact || contact.isMe) {
      continue;
    }

    const name = getContactName(contact);
    msg += `*${name}* - ${participant.id.user}\n\n`;
  }

  client.reply(message.from, msg, message.id);
};

const viewGroup: CommandData = {
  func,
  description: 'Mostra o chat do grupo informado',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.viewgroup', '.vg'],
  allowedUsers: 'admin',
  allowInGroups: true,
  allowInPrivate: true,
};

export default viewGroup;
