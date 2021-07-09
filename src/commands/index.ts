import { Client, Message } from '@open-wa/wa-automate';
import { getCommands } from './command-list';
import { commandParser } from './command-parser';
import { CommandData } from './protocols/command';

interface ExecCommandParams {
  message: Message;
  client: Client;
  query: string;
}

export async function execCommand({
  message,
  client,
  query,
}: ExecCommandParams) {
  try {
    const { value, command } = commandParser(query);

    let commandToBeExecuted: CommandData | null = null;

    const commandList = await getCommands();

    for (const commandData of commandList) {
      if (commandData.command === command) {
        commandToBeExecuted = commandData;
        break;
      }
    }

    if (!commandToBeExecuted) {
      return;
    }

    if (commandToBeExecuted.onlyForGroups && !message.chat.isGroup) {
      await client.sendText(message.from, 'Este comando é apenas para grupos');
      return;
    }

    commandToBeExecuted.func({
      client,
      message,
      value,
    });
  } catch (error) {
    console.log(error);
    await client.reply(
      message.from,
      'Erro ao executar o comando :(',
      message.id
    );
  }
}
