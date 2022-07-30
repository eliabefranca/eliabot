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

  const userId = getUserIdFromMessage(message, value);

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
  command: ['.add'],
  category: CommandType.GROUP_MANAGEMENT,
  func,
  description: 'Adiciona um membro ao grupo',
  hidden: false,
  allowInGroups: true,
  allowInPrivate: false,
};

export default prob;
