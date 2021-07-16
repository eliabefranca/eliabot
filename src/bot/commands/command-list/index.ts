import fg from 'fast-glob';
import path from 'path';
import { CommandData } from '../protocols/command';

function getFiles(subDirectory?: string): string {
  if (subDirectory) {
    return path.join(__dirname, subDirectory, '*.ts').replace(/\\/g, '/');
  }

  return path.join(__dirname, '*.ts').replace(/\\/g, '/');
}

export const getCommandList = async (): Promise<CommandData[]> => {
  const files = fg.sync(getFiles()).filter((file) => !/index.ts$/.test(file));

  const commands = [] as CommandData[];

  for (const file of files) {
    const command = (await import(`${file}`)).default;
    commands.push(command);
  }

  const adminFiles = fg.sync(getFiles('admin'));

  for (const file of adminFiles) {
    const command = (await import(`${file}`)).default;
    commands.push(command);
  }

  const moderatorFiles = fg.sync(getFiles('moderator'));

  for (const file of moderatorFiles) {
    const command = (await import(`${file}`)).default;
    commands.push(command);
  }

  return commands;
};
