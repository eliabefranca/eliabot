import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ message, client, value }) => {
  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe && member.id !== message.sender.id;
  });

  const firstMember = filtered[Math.floor(Math.random() * filtered.length)];

  const contactNumber1 = firstMember.id.split('@')[0];

  await client.sendTextWithMentions(
    message.from,
    `quem ${value}: 😶👉 @${contactNumber1}`,
    message.id as any
  );
};

const quem: CommandData = {
  func,
  command: '.quem',
  description: '',
  onlyForGroups: true,
};

export default quem;
