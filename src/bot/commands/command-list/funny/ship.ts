import { getNumberFromContactId } from '../../utils/get-number-from-contact-id';
import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandom } from '@utils';

const func: Command = async ({ client, message }) => {
  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe;
  });

  const firstMember = getRandom(filtered);

  filtered = filtered.filter((member) => {
    return member.id !== firstMember.id;
  });

  const secondMember = getRandom(filtered);

  const contactNumber1 = getNumberFromContactId(firstMember.id);
  const contactNumber2 = getNumberFromContactId(secondMember.id);

  await client.sendTextWithMentions(
    message.from,
    `@${contactNumber1} e @${contactNumber2} estão namorando e vão se casar 😍`
  );
};

const ship: CommandData = {
  command: ['.ship'],
  category: CommandType.FUNNY,
  description: 'Forma um casal aleatório no grupo',
  func,
  allowInGroups: true,
  allowInPrivate: false,
};

export default ship;
