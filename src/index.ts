import { Message } from 'core/protocols';
import { parseCommand } from 'core/functions/parseCommand';
import { bot } from './core';
import { UserCreationAttributes, UserModel } from 'database/models/user/user';

async function main() {
  await bot.start();

  bot.on<Message<any>>('message', async (message) => {
    const text = message.text || message.caption || '';
    const { keyword, value, args } = await parseCommand(text ?? '');

    const command = bot.commands.find((command) =>
      command.keywords.includes(keyword)
    );

    if (command) {
      command.handler({
        client: bot,
        message,
        value: value,
        args,
      });
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
      const { args, keyword, value } = parseCommand(commandStr);

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
