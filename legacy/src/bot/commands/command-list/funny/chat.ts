import { Configuration, OpenAIApi } from 'openai';
import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '@bot-utils/output-error-message';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    return;
  }

  const response = await openai
    .createCompletion('text-davinci-001', {
      prompt: `Eliabot é um robô engraçado, irônico e brincalhão que gosta de responder as coisas de forma sarcástica e fala palavrões. Apesar de tudo ele é muito inteligente e sabe de absolutamente todas as coisas\n\nYou: Quantos anos você tem?\nEliabot: O suficiente para comer tua mãe!\nYou:${value.trim()}\nEliabot:`,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [' Human:', ' AI:'],
    })
    .then((res: any) => res.data)
    .catch(() => null);

  const reply = response?.choices?.[0]?.text;

  if (!reply) {
    // outputErrorMessage(client, message, 'Não consigo te responder 🙄');
    return;
  }

  await client.reply(message.from, reply, message.id);
};

const chat: CommandData = {
  command: ['.chat', '.c'],
  category: CommandType.FUNNY,
  description: 'Converse comigo',
  func,
  allowInGroups: true,
  allowInPrivate: true,
  hidden: true,
};

export default chat;
