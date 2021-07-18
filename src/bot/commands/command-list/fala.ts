import { Command, CommandData } from '../protocols/command';
import * as googleTTS from 'google-tts-api';

const supportedLanguages = [
  'af-ZA',
  'ar-XA',
  'bn-IN',
  'bg-BG',
  'ca-ES',
  'yue-HK',
  'cs-CZ',
  'da-DK',
  'nl-BE',
  'nl-NL',
  'en-US',
  'en-AU',
  'en-IN',
  'en-GB',
  'fil-PH',
  'fi-FI',
  'fr-CA',
  'fr-FR',
  'de-DE',
  'el-GR',
  'gu-IN',
  'hi-IN',
  'hu-HU',
  'is-IS',
  'id-ID',
  'it-IT',
  'ja-JP',
  'kn-IN',
  'ko-KR',
  'lv-LV',
  'ms-MY',
  'ml-IN',
  'cmn-CN',
  'cmn-TW',
  'nb-NO',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'sr-RS',
  'sk-SK',
  'es-ES',
  'es-US',
  'sv-SE',
  'ta-IN',
  'te-IN',
  'th-TH',
  'tr-TR',
  'uk-UA',
  'vi-VN',
];
const func: Command = async (params) => {
  const { value, client, message } = params;

  let lang = 'pt-BR';
  let waitMessageSent = false;

  if (!value) {
    await client.reply(
      message.from,
      'Tem que mandar um texto para eu imitar, pô',
      message.id
    );
    return;
  }

  const getLangRegex = /#([a-z]{2,3}|[a-z]{4,5}|[a-z]{2,3}-[a-z]{2})$/i;
  if (getLangRegex.test(value)) {
    let langCode = (value.match(getLangRegex) as RegExpMatchArray)[0]
      .replace('#', '')
      .replace('-', '');

    if (langCode.length > 3) {
      langCode =
        langCode.length === 5
          ? `${langCode.slice(0, 3).toLowerCase()}-${langCode
              .slice(2)
              .toUpperCase()}`
          : `${langCode.slice(0, 2).toLowerCase()}-${langCode
              .slice(2)
              .toUpperCase()}`;
    }

    const langCodeIsValid = supportedLanguages.some((lang) =>
      langCode.length < 4
        ? lang.indexOf(langCode.toLowerCase()) === 0
        : lang === langCode
    );

    if (langCodeIsValid) {
      lang = langCode;
    } else {
      await client.reply(
        message.from,
        'O código informado não é válido, o áudio será enviado em português 🇧🇷. Aguarde...',
        message.id
      );
      waitMessageSent = true;
    }
  }

  if (!waitMessageSent) {
    await client.reply(
      message.from,
      'Estou procurando o áudio 🧐🔎, aguarde.',
      message.id
    );
    waitMessageSent = true;
  }

  const text = value.replace(getLangRegex, '');
  const audioUrl = googleTTS.getAudioUrl(text, {
    lang,
    host: 'https://translate.google.com',
  });
  client.sendAudio(message.chatId, audioUrl, message.id);
};

const fala: CommandData = {
  func,
  command: '.fala',
  description:
    'Transforma um texto digitado em áudio do zap.\nVocê pode informar o código do idioma com # ex: .fala hello #enus ou #en-US',
  onlyForGroups: false,
  category: 'funny',
};

export default fala;
