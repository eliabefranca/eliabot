export interface IFileReader {
  write(value: string): void;
  read(): string;
  createFileIfNotExist(path: string): void;
  createFolderIfNotExist(path: string): void;
}
