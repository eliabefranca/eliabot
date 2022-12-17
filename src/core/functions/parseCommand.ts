import { CommandData } from '../protocols';

export function parseCommand(text: string) {
  const formattedText = text.replace(/^\. /, '.').replace(/^(,|\/|!|#)/, '.');
  const keyword = formattedText.split(' ')[0].trim();
  const value = formattedText.replace(keyword, '').trim();

  return {
    keyword,
    value,
  };
}
