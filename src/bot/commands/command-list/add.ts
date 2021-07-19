import { Command, CommandData, CommandType } from '../protocols';
import { outputErrorMessage } from '../../utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  const groupsThatIamAdmin = await client.iAmAdmin();
  if (!groupsThatIamAdmin.includes(message.chat.id as any)) {
    await outputErrorMessage(
      client,
      message,
      'Eu não sou administrador desse grupo.'
    );
    return;
  }

  const senderIsAdmin = message.chat.groupMetadata.participants.some(
    (participant) =>
      (participant.id as any) === message.sender.id && participant.isAdmin
  );
  if (!senderIsAdmin) {
    await outputErrorMessage(client, message, 'Você não é um administrador');
    return;
  }

  if (!value && !message.quotedMsg) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa me enviar o número.'
    );
    return;
  }

  const userId =
    value
      ?.trim()
      .replace('@', '')
      .replace('+', '')
      .replace(/\(/gi, '')
      .replace(/\)/gi, '')
      .replace(/-/gi, '')
      .replace(/ /gi, '') + '@c.us';

  const success = await client
    .addParticipant(message.chat.id as any, userId as any)
    .catch(() => false);

  if (!success) {
    await client.reply(
      message.from,
      'Não foi possível adicionar o membro, verifique o número fornecido.',
      message.id
    );
    return;
  }

  await client.reply(message.from, 'Membro adicionado com sucesso', message.id);
};

const prob: CommandData = {
  command: '.add',
  category: CommandType.GROUP_MANAGEMENT,
  func,
  description: 'Adiciona um membro ao grupo',
  onlyForGroups: true,
  hidden: false,
};

export default prob;
