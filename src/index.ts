import { Message } from 'core/protocols';
import { parseCommand } from 'core/functions/parseCommand';
import { bot } from './core';
import { UserCreationAttributes, UserModel } from 'database/models/user/user';

const isEuNamoro = (text: string) => {
  const lowerCase = text.toLowerCase();
  const hasNamoro =
    lowerCase.includes('namor') ||
    lowerCase.includes('nam0ro') ||
    lowerCase.includes('nam0r0') ||
    lowerCase.includes('n4m0r0') ||
    lowerCase.includes('n4mor0') ||
    lowerCase.includes('n4m0ro') ||
    lowerCase.includes('tenho um relacionamento');

  const hasEu = lowerCase.includes('eu') || lowerCase.includes('3u');

  return hasEu && hasNamoro;
};

async function main() {
  await bot.start();

  bot.on<Message<any>>('message', async (message) => {
    const text = message.text || message.caption || '';
    const { keyword, value, args } = await parseCommand(text ?? '');

    if (
      message.sender.id === '553193413855@s.whatsapp.net' &&
      isEuNamoro(text)
    ) {
      bot.deleteMessage({ message, chatId: message.chatId });
    }

    const command = bot.commands.find((command) =>
      command.keywords.includes(keyword)
    );

    if (command) {
      try {
        command.handler({
          client: bot,
          message,
          value: value,
          args,
        });
      } catch (error) {
        bot.sendMessage({
          chatId: message.chatId,
          text: 'Ocorreu um erro ao executar o comando',
        });
        console.log(error);
      }
    }

    // handle replies on command results
    const quotedText = message.quoted?.text ?? '';
    if (!quotedText) {
      return;
    }

    const quotedKeywordReg = /%\.\w+%$/gim;
    const wasCommandResponse = quotedKeywordReg.test(quotedText);

    if (wasCommandResponse) {
      const commandStr = quotedText
        .match(quotedKeywordReg)![0]
        .replace(/%/gi, '');
      const { args, keyword } = parseCommand(commandStr);

      const command = bot.commands.find((command) =>
        command.keywords.includes(keyword)
      );

      if (command) {
        command.handler({
          client: bot,
          message,
          value: text,
          args: [...args, 'handleReply'],
        });
      }
    } else {
      return;
    }

    const user: UserCreationAttributes = {
      id: message.sender.id,
      name: message.sender.name,
      number: message.sender?.number ?? message.sender.id,
    };
    await UserModel.findOrCreate({ where: { id: user.id }, defaults: user });
  });
}

main();
