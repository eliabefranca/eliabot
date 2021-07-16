import fg from 'fast-glob';
import path from 'path';
import { CommandData } from '../protocols/command';

function getFiles(subDirectory?: string): string {
  if (subDirectory) {
    return path.join(__dirname, subDirectory, '*.(ts|js)').replace(/\\/g, '/');
  }

  return path.join(__dirname, '*.(ts|js)').replace(/\\/g, '/');
}

export const getCommandList = async (): Promise<CommandData[]> => {
  const publicCommandFiles = fg
    .sync(getFiles())
    .filter((file) => !/index\..s$/.test(file));
  const moderatorCommandFiles = fg.sync(getFiles('moderator'));
  const adminCommandFiles = fg.sync(getFiles('admin'));
  const commands = [] as CommandData[];

  const commandFiles = [
    ...publicCommandFiles,
    ...moderatorCommandFiles,
    ...adminCommandFiles,
  ];

  for (const commandFile of commandFiles) {
    const commandData: CommandData | undefined = (
      await import(`${commandFile}`)
    ).default;

    if (commandData) {
      commands.push(commandData);
    }
  }

  return commands;
};
