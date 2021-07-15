import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ client, message, value }) => {
  const groupsThatIamAdmin = await client.iAmAdmin();
  if (!groupsThatIamAdmin.includes(message.chat.id as any)) {
    await client.reply(
      message.from,
      'Eu não sou administrador desse grupo.',
      message.id
    );
    return;
  }

  const senderIsAdmin = message.chat.groupMetadata.participants.some(
    (participant) =>
      (participant.id as any) === message.sender.id && participant.isAdmin
  );
  if (!senderIsAdmin) {
    await client.reply(message.from, 'Você não é um administrador', message.id);
    return;
  }

  if (!value && !message.quotedMsg) {
    await client.reply(
      message.from,
      'Você precisa me enviar o número.',
      message.id
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
  func,
  description: 'Adiciona um membro ao grupo',
  onlyForGroups: true,
  hidden: false,
};

export default prob;
