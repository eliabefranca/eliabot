import {Command, CommandData} from '../protocols/command';
import {CommandType} from "../protocols/commandType";
import {getRandom} from "../../../helpers/get-random";

const func: Command = async (params) => {
  const { client, message } = params;
  const answers = ['Sim.', 'Não.', 'Talvez.'];
  const answer = getRandom(answers);
  await client.reply(message.from, `${answer}`, message.id);
};

const yesOrNo: CommandData = {
  command: '.p',
  category: CommandType.FUNNY,
  description: 'Responde sim, não ou talvez',
  func,
};

export default yesOrNo;
