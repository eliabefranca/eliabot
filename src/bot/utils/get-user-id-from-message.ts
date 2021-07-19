import { Message } from '@open-wa/wa-automate';

export function getUserIdFromMessage(
  message: Message,
  value: string | undefined
): string {
  let userId = '';

  if (value) {
    userId = value?.trim().replace('@', '').replace('+', '') + '@c.us';
  }

  if (message.quotedMsg) {
    userId = message.quotedMsg.sender.id;
  }

  return userId;
}
