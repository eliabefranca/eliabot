import { Command, CommandData } from '../../protocols/command';

const func: Command = async ({ client, message }) => {
  await client.reply(message.from, 'Você é um administrador', message.id);
};

const test: CommandData = {
  func,
  description: '',
  command: '.admin',
  allowedUsers: 'admin',
};

export default test;
