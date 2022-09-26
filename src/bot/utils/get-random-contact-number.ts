import { Client, Message } from '@open-wa/wa-automate';
import { getRandom } from 'src/utils';

export const getRandomContactNumber = async (
  client: Client,
  message: Message,
  filterSender: boolean = true
) => {
  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    if(filterSender === false){
      return !member.isMe
    } else {
      return !member.isMe && member.id !== message.sender.id;
    }
  });

  const firstMember = getRandom(filtered);

  return firstMember.id.split('@')[0];
};
