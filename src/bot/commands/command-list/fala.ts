import { Command, CommandData } from '../protocols/command';
import * as googleTTS from 'google-tts-api';

const func: Command = async (params) => {
    const { value, client, message } = params;

    if (!value) {
      await client.reply(
        message.from,
        'Tem que mandar um texto para eu imitar, pô',
        message.id
      );
      return;
    }



    const audioUrl = googleTTS.getAudioUrl(value, {
      lang: 'pt-BR',
      host: 'https://translate.google.com',
    });
    client.sendAudio(message.chatId, audioUrl, message.id);
};

const fala: CommandData = {
  func,
  command: '.fala',
  description: 'Transforma um texto digitado em áudio do zap.',
  onlyForGroups: false,
};

export default fala;
