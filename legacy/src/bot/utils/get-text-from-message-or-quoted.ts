import { Message } from '@open-wa/wa-automate';

export function getTextFromValueOrQuoted(
  message: Message,
  value: string | null | undefined
): string | null {
  const { quotedMsg } = message;

  if (value && value.trim()) {
    return value;
  }

  if (!quotedMsg) {
    return null;
  }

  let txt = null;

  const { body } = quotedMsg;
  if (body && body.trim()) {
    txt = body;
  }

  return txt;
}
