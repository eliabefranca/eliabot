import makeWASocket, { proto } from '@adiwajshing/baileys';
import { getCommandList } from '../commands';
import { CommandData, CommandParams } from '../types/command';

export let commandList: CommandData[] = [];

export const parseCommand = (text: string) => {
  const formattedText = text.replace(/^\. /, '.').replace(/^(,|\/|!|#)/, '.');
  const command = formattedText.split(' ')[0].trim();
  const value = formattedText.replace(command, '').trim();
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

interface CommandHandlerParams extends CommandParams {
  client: ReturnType<typeof makeWASocket>;
  messageInfo: proto.IWebMessageInfo;
}

export const getCommandData = async (
  text: string
): Promise<CommandData | null> => {
  if (!commandList.length) {
    commandList = await getCommandList();
  }

  const { command } = parseCommand(text);

  const commandData = getCommand(command, commandList);

  return commandData;
};

export async function handleCommand({
  client,
  messageInfo,
}: CommandHandlerParams): Promise<boolean> {
  let text = '';

  if (messageInfo.message?.conversation) {
    text = messageInfo.message.conversation;
  } else if (messageInfo.message?.imageMessage) {
    text = messageInfo.message.imageMessage.caption ?? '';
  } else if (messageInfo.message?.videoMessage) {
    text = messageInfo.message.videoMessage.caption ?? '';
  }

  const commandData = await getCommandData(text);

  if (!commandData) {
    return false;
  }

  const { value } = parseCommand(text);

  let success = false;

  await commandData
    .func({
      client,
      messageInfo,
      value,
    })
    .then(() => {
      success = true;
    })
    .catch(async (error) => {
      console.log(error);

      await client.sendMessage(
        messageInfo.key.remoteJid!,
        { text: 'Erro ao executar o comando :(' },
        { quoted: messageInfo }
      );
    });

  return success;
}
