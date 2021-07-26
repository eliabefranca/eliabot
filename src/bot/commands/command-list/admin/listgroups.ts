import { Command, CommandData, CommandType } from '@command-protocols';

const func: Command = async ({ client, message, value }) => {
  const groups = await client.getAllGroups();

  let msg = '';

  for (const group of groups) {
    msg += `${group.name}\n${group.id}\n\n`;
  }

  await client.reply(message.from, msg, message.id);
};

const listGroups: CommandData = {
  func,
  description: 'Lista os grupos que eu estou presente',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.listgroups', '.lg'],
  allowedUsers: 'admin',
};

export default listGroups;
