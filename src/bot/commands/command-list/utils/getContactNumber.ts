import {Client, Message} from "@open-wa/wa-automate";

const getContactNumber = async (client: Client, message: Message) => {
  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe && member.id !== message.sender.id;
  });

  const firstMember = filtered[Math.floor(Math.random() * filtered.length)];

  return firstMember.id.split('@')[0];
}

export default getContactNumber