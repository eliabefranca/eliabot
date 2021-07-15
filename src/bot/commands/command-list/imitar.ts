import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ client, message, value }) => {
  const { quotedMsg } = message;

  if (!quotedMsg) {
    await client.reply(
      message.from,
      'Você precisa responder a mensagem que deseja que eu imite.',
      message.id
    );
    return;
  }

  const { body, caption } = quotedMsg;
  let txt = body ? body : caption;

  txt = txt.replace(/[aeiouãẽĩõũáéíóúâêîôûàèìòùäëïöü]/gi, 'i');

  await client.reply(message.from, txt, quotedMsg.id);
};

const imitar: CommandData = {
  func,
  command: '.imitar',
  description: 'Imita uma mensagem.',
  onlyForGroups: true,
};

export default imitar;
