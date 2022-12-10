import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { CommandData } from 'src/types/command';

function getFiles(subDirectory?: string): string {
  if (subDirectory) {
    return path.join(__dirname, subDirectory, '*.(ts|js)').replace(/\\/g, '/');
  }
  return path.join(__dirname, '*.(ts|js)').replace(/\\/g, '/');
}

function getSubFolders(): string[] {
  const folders = fs.readdirSync(__dirname);
  return folders.filter((folder) =>
    fs.statSync(path.join(__dirname, folder)).isDirectory()
  );
}

export const getCommandList = async (): Promise<CommandData[]> => {
  const commands = [] as CommandData[];

  let commandFiles = fg
    .sync(getFiles())
    .filter((file) => !/index\..s$/.test(file));

  for (const folder of getSubFolders()) {
    const folderFiles = fg
      .sync(getFiles(folder))
      .filter((file) => !/index\..s$/.test(file));

    let folderFolders = fs.readdirSync(path.join(__dirname, folder));
    folderFolders = folderFolders
      .map((file) => path.join(__dirname, folder, file))
      .filter((file) => fs.statSync(file).isDirectory())
      .map((file) => `${file}/index.ts`);

    commandFiles = [...commandFiles, ...folderFiles, ...folderFolders];
  }

  for (const commandFile of commandFiles) {
    const importPath = commandFile.includes('.ts')
      ? commandFile
      : `${commandFile}/index.ts`;
    const commandData: CommandData | undefined = (await import(importPath))
      .default;

    if (commandData) {
      commands.push(commandData);
    }
  }

  return commands;
};
