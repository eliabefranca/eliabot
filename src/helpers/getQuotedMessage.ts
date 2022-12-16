import { proto } from '@adiwajshing/baileys';

export function getQuotedMessage(
  messageInfo: proto.IWebMessageInfo | undefined | null
) {
  return messageInfo?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
}
