import { Client, Message } from '@open-wa/wa-automate';
import { commandList } from './command-list';
import { commandParser } from './command-parser';

interface ExecCommandParams {
  message: Message;
  client: Client;
}

export async function execCommand({ message, client }: ExecCommandParams) {
  const query = message.body;

  const { value, command } = commandParser(query);

  for (const commandData of commandList) {
    if (commandData.command === command) {
      commandData.func({
        client,
        message,
        value,
      });
    }
  }
}
