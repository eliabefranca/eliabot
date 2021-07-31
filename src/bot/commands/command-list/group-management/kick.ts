import { Command, CommandData, CommandType } from '@command-protocols';
import { getUserIdFromMessage, outputErrorMessage } from '@bot-utils';

const func: Command = async ({ client, message, value }) => {
  const groupsThatIamAdmin = await client.iAmAdmin();
  if (!groupsThatIamAdmin.includes(message.chat.id as any)) {
    await outputErrorMessage(
      client,
      message,
      'Eu não sou administrador deste grupo.'
    );
    return;
  }

  const senderIsAdmin = message.chat.groupMetadata.participants.some(
    (participant) =>
      (participant.id as any) === message.sender.id && participant.isAdmin
  );
  if (!senderIsAdmin) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa marcar o usuário ou me enviar o número.'
    );
    return;
  }

  if (!value && !message.quotedMsg) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa marcar o usuário ou me enviar o número.'
    );
    return;
  }

  let userId = getUserIdFromMessage(message, value);

  const success = await client
    .removeParticipant(message.chat.id as any, userId as any)
    .catch(() => false);

  if (!success) {
    await outputErrorMessage(
      client,
      message,
      'Não foi possível remover este membro, verifique o número fornecido ou se ele é dono do grupo.'
    );
    return;
  }

  await client.reply(message.from, 'Membro removido com sucesso', message.id);
};

const prob: CommandData = {
  command: ['.kick'],
  category: CommandType.GROUP_MANAGEMENT,
  func,
  description: 'Expulsa um membro do grupo',
  hidden: false,
  allowInGroups: true,
  allowInPrivate: false,
};

export default prob;
