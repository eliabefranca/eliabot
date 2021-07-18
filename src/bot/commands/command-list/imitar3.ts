import { Command, CommandData } from '../protocols/command';
import * as googleTTS from 'google-tts-api';

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
  const txt = quotedMsg.isMedia ? caption : body;

  if (!txt?.trim()) {
    await client.reply(message.from, 'A mensagem está vazia.', message.id);
    return;
  }

  const audioUrl = googleTTS.getAudioUrl(txt, {
    lang: 'pt-BR',
    host: 'https://translate.google.com',
  });

  client.sendAudio(message.chatId, audioUrl, quotedMsg.id);
};

const imitar: CommandData = {
  func,
  command: '.imitar3',
  description: 'Imita em audio uma mensagem marcada.',
  category: 'funny',
  onlyForGroups: false,
};

export default imitar;
