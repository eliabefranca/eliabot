import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ client, message }) => {
  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe && member.id !== message.sender.id;
  });

  const firstMember = filtered[Math.floor(Math.random() * filtered.length)];

  const contactNumber1 = firstMember.id.split('@')[0];

  // await client.sendText(message.from, `😶👉 @${contactNumber1}`, message.id);

  await client.sendTextWithMentions(
    message.from,
    `Filha : Mae Quero Perder A Virgindade 😨
Mae : Com Quem ? 👀
Filha : Com o @${contactNumber1}
Mãe : Você Tá Louca Quer Perde A Virgindade Ou A Capacidade de Andar😨💔
    
taporra 🥴💥`,
    message.id as any
  );
};

const virgindade: CommandData = {
  command: '.virgindade',
  func,
  description: 'Descubra 😳',
  onlyForGroups: true,
};

export default virgindade;
