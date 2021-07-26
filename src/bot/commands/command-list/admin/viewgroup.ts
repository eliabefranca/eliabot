import { Command, CommandData, CommandType } from '@command-protocols';
import { CONFIG } from 'config';
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
  msg += `Grupo ${targetGroup.name} - ${targetGroup.id}\n\n`;
  participants.forEach((participant) => {
    msg += `*${participant.id}*\n`;
  });

  client.reply(message.from, msg, message.id);
};

const viewGroup: CommandData = {
  func,
  description: 'Mostra o chat do grupo informado',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.viewGroup', '.vg'],
  allowedUsers: 'admin',
};

export default viewGroup;
