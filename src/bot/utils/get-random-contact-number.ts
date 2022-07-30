import { Client, Message } from '@open-wa/wa-automate';
import { getRandom } from 'src/utils';

export const getRandomContactNumber = async (
  client: Client,
  message: Message
) => {
  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe && member.id !== message.sender.id;
  });

  const firstMember = getRandom(filtered);

  return firstMember.id.split('@')[0];
};
