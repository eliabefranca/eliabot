import { usersDb } from '@json-db';
import { Client, Message } from '@open-wa/wa-automate';
import { getCommandList } from '../commands/command-list';
import { CommandData } from '../commands/protocols';

export let commandList: CommandData[] = [];

export const parseCommand = (query: string) => {
  const formattedQuery = query.replace(/^\. /, '.').replace(/^(,|\/|!|#)/, '.');
  const command = formattedQuery.split(' ')[0].trim();
  const value = formattedQuery.replace(command, '').trim();
  return {
    command: command.toLowerCase(),
    value: value.replace(/"/gi, ''),
  };
};

function getCommand(
  command: string,
  commandList: CommandData[]
): CommandData | null {
  let commandToBeExecuted = null;

  commandList.forEach((com) => {
    if (com.command.includes(command)) {
      commandToBeExecuted = com;
    }
  });

  return commandToBeExecuted;
}

interface CommandHandlerParams {
  commandData: CommandData;
  query: string;
  message: Message;
  client: Client;
}

export const getCommandData = async (
  query: string
): Promise<CommandData | null> => {
  if (!commandList.length) {
    commandList = await getCommandList();
  }

  const { command } = parseCommand(query);

  const commandData = getCommand(command, commandList);

  return commandData;
};

export async function handleCommand({
  commandData,
  query,
  client,
  message,
}: CommandHandlerParams): Promise<boolean> {
  if (!commandData) {
    return false;
  }

  const { value } = parseCommand(query);

  const senderIsAdmin =
    usersDb.getFirst({ id: message.sender.id })?.role === 'admin';

  if (!commandData.allowInGroups && message.chat.isGroup && !senderIsAdmin) {
    await client.reply(
      message.from,
      'Este comando não pode ser utilizado em grupos ⛔',
      message.id
    );
    return false;
  }

  if (!commandData.allowInPrivate && !message.chat.isGroup && !senderIsAdmin) {
    await client.reply(
      message.from,
      'Este comando não pode ser utilizado em mensagens privadas ⛔',
      message.id
    );
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
