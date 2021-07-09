import { Command, CommandData } from '../protocols/command';

const func: Command = async (params) => {
  const { client, message } = params;
  const answers = ['Sim.', 'Não.', 'Talvez.'];
  const option = Math.floor(Math.random() * answers.length);
  await client.reply(message.from, `${answers[option]}`, message.id);
};

const yesOrNo: CommandData = {
  command: '.p',
  description: 'Responde sim ou não',
  func,
};

export default yesOrNo;
