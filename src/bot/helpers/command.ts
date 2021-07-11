import { Client, Message } from '@open-wa/wa-automate';
import { getCommandList } from '../commands/command-list';
import { CommandData } from '../commands/protocols/command';

export const parseCommand = (query: string) => {
  const command = query.split(' ')[0].trim();
  const value = query.replace(command, '').trim();
  return {
    command: command.toLowerCase(),
    value: value.replace(/"/gi, ''),
  };
};

export function getCommand(
  command: string,
  commandList: CommandData[]
): CommandData | null {
  let commandToBeExecuted = null;

  commandList.forEach((com) => {
    if (com.command === command) {
      commandToBeExecuted = com;
    }
  });

  return commandToBeExecuted;
}

interface CommandHandlerParams {
  query: string;
  message: Message;
  client: Client;
}

export async function handleCommand({
  query,
  client,
  message,
}: CommandHandlerParams): Promise<boolean> {
  const commandList = await getCommandList();

  const { command, value } = parseCommand(query);

  const commandData = getCommand(command, commandList);

  if (!commandData) {
    return false;
  }

  if (commandData.onlyForGroups && !message.chat.isGroup) {
    await client.sendText(message.from, 'Este comando é apenas para grupos');
    return false;
  }

  let success = false;

  await commandData
    .func({
      client,
      message,
      value,
    })
    .then(() => {
      success = true;
    })
    .catch(async (error) => {
      console.log(error);
      await client.reply(
        message.from,
        'Erro ao executar o comando :(',
        message.id
      );
    });

  return success;
}
