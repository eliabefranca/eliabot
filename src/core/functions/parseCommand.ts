export function parseCommand(text: string) {
  const formattedText = text.replace(/^\. /, '.').replace(/^(,|\/|!|#)/, '.');
  const commandPart =
    formattedText.match(/([\.\\\/\!\,]\w+).* ?/gim)?.[0] ?? ''; // eslint-disable-line

  const keyword = commandPart.split(' ')[0];
  const value = commandPart
    .replace(keyword, '')
    .replace(/( \#\w+)/gim, '') // eslint-disable-line
    .trim();

  const args = commandPart
    .split(' ')
    .filter((p) => p.startsWith('#'))
    .map((p) => p.replace('#', ''));

  return {
    keyword,
    value,
    args,
  };
}
