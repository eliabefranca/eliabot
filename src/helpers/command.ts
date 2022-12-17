import makeWASocket, { proto } from '@adiwajshing/baileys';
import { getCommandList } from '../commands_old';
import { CommandData, CommandParams } from '../types/command';
import { getQuotedMessage } from './getQuotedMessage';

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

function getTextFromMessage(message: proto.IMessage | undefined | null) {
  if (!message) return '';

  let text = '';

  if (message?.conversation) {
    text = message.conversation;
  } else if (message?.imageMessage) {
    text = message.imageMessage.caption ?? '';
  } else if (message?.videoMessage) {
    text = message.videoMessage.caption ?? '';
  } else if (message?.extendedTextMessage) {
    text = message.extendedTextMessage.text ?? '';
  }

  return text;
}

export async function handleCommand({
  client,
  messageInfo,
}: CommandHandlerParams): Promise<boolean> {
  let fromQuoted = false;
  const quotedMessageInfo = getQuotedMessage(messageInfo);
  if (quotedMessageInfo) {
    fromQuoted = true;
  }

  let text = getTextFromMessage(messageInfo.message);

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
      fromQuoted,
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
