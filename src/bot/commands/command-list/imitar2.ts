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
  let txt = quotedMsg.isMedia ? caption : body;

  if (txt.trim() === '') {
    await client.reply(message.from, 'A mensagem está vazia.', message.id);
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
  category: 'funny',
  command: '.imitar2',
  description: 'Imita uma mensagem.',
  onlyForGroups: true,
};

export default imitar;
