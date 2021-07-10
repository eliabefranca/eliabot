export const commandParser = (query: string) => {
  const command = query.split(' ')[0].trim();
  const value = query.replace(command, '').trim();
  return {
    command: command.toLowerCase(),
    value: value.replace(/"/gi, ''),
  };
};
