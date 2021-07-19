import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '../../utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  const { quotedMsg } = message;

  if (!quotedMsg) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa responder a mensagem que deseja que eu imite.'
    );
    return;
  }

  const { body, caption } = quotedMsg;
  let txt = quotedMsg.isMedia ? caption : body;

  if (txt.trim() === '') {
    await outputErrorMessage(client, message, 'A mensagem está vazia.');
    return;
  }

  txt = txt
    .split('')
    .map((letter, index) =>
      Math.floor(Math.random() * 2) % 2 === 0
        ? letter.toUpperCase()
        : letter.toLowerCase()
    )
    .join('');

  await client.reply(message.from, txt, quotedMsg.id);
};

const imitar: CommandData = {
  func,
  category: CommandType.FUNNY,
  command: '.imitar2',
  description: 'Imita uma mensagem.',
  onlyForGroups: true,
};

export default imitar;
