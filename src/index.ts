import { Message } from 'core/protocols';
import { parseCommand } from 'core/functions/parseCommand';
import { bot } from './core';
import { UserCreationAttributes, UserModel } from 'database/models/user/user';

async function main() {
  await bot.start();

  bot.on<Message<any>>('message', async (message) => {
    const text = message.text || message.caption;

    const { keyword, value } = await parseCommand(text ?? '');
    const command = bot.commands.find((command) =>
      command.keywords.includes(keyword)
    );

    if (command) {
      command.handler({
        client: bot,
        message,
        value: value,
      });
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
