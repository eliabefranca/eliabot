import fg from 'fast-glob';
import path from 'path';
import { CommandData } from '../protocols/command';

export const getCommands = async (): Promise<CommandData[]> => {
  const files = fg
    .sync(path.join(__dirname, '*.ts'))
    .filter((file) => !/index.ts$/.test(file));

  const commands = [] as CommandData[];

  for (const file of files) {
    const command = (await import(`${file}`)).default;
    commands.push(command);
  }

  return commands;
};
