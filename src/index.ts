import { Message } from 'core/protocols';
import { parseCommand } from 'core/functions/parseCommand';
import { bot } from './core';

async function main() {
  await bot.start();

  bot.on<Message<any>>('message', async (message) => {
    const { keyword, value } = await parseCommand(message.text);
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
  });
}

main();
