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
      'Você precisa marcar o usuário ou me enviar o número.',
      message.id
    );
  }

  let userId = '';

  if (value) {
    userId = value?.trim().replace('@', '').replace('+', '') + '@c.us';
  }

  if (message.quotedMsg) {
    userId = message.quotedMsg.sender.id;
  }

  const success = await client
    .removeParticipant(message.chat.id as any, userId as any)
    .catch(() => false);

  if (!success) {
    await client.reply(
      message.from,
      'Não foi possível remover este membro, verifique o número fornecido ou se ele é dono do grupo.',
      message.id
    );
    return;
  }

  await client.reply(message.from, 'Membro removido com sucesso', message.id);
};

const prob: CommandData = {
  command: '.kick',
  func,
  description: 'Expulsa um membro do grupo',
  onlyForGroups: true,
  hidden: false,
};

export default prob;
