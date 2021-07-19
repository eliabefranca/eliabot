import * as googleTTS from 'google-tts-api';
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
  const txt = quotedMsg.isMedia ? caption : body;

  if (!txt?.trim()) {
    await outputErrorMessage(client, message, 'A mensagem está vazia.');
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
  category: CommandType.FUNNY,
  onlyForGroups: false,
};

export default imitar;
