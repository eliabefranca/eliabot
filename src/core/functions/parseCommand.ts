export function parseCommand(text: string) {
  const formattedText = text.replace(/^\. /, '.').replace(/^(,|\/|!|#)/, '.');
  const keyword = formattedText.split(' ')[0].trim();
  const value = formattedText.replace(keyword, '').trim();
  const params = value
    .split(' ')
    .filter((p) => p.startsWith('#'))
    .map((p) => p.replace('#', ''));

  return {
    keyword,
    value,
    params,
  };
}
