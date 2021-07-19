import {Command, CommandData} from '../protocols/command';
import {CommandType} from "../protocols/commandType";
import {outputErrorMessage} from "../../utils/output-error-message";

const func: Command = async ({ client, message, value }) => {
  const { quotedMsg } = message;

  if (!quotedMsg) {
    await outputErrorMessage(client, message, 'Você precisa responder a mensagem que deseja que eu imite.');
    return;
  }

  const { body, caption } = quotedMsg;
  let txt = body ? body : caption;

  txt = txt.replace(/[aeiouãẽĩõũáéíóúâêîôûàèìòùäëïöü]/g, 'i');
  txt = txt.replace(/[AEIOUÃẼĨÕŨÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÄËÏÖÜ]/g, 'I');

  await client.reply(message.from, txt, quotedMsg.id);
};

const imitar: CommandData = {
  func,
  command: '.imitar',
  category: CommandType.FUNNY,
  description: 'Imita uma mensagem.',
  onlyForGroups: true,
};

export default imitar;
