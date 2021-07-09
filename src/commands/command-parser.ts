export const commandParser = (query: string) => {
  const command = query.split(' ')[0].trim();
  const value = query.replace(command, '').trim();
  return {
    command,
    value: value.replace(/"/gi, ''),
  };
};
