import fs from 'fs';
import { IFileReader } from '../protocols/file-reader';

export class FileReader implements IFileReader {
  filePath: string;
  value: string = '';

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  read(): string {
    this.value = fs.readFileSync(this.filePath, 'utf8');
    return this.value;
  }

  write(value: string): void {
    this.value = value;
    fs.writeFileSync(this.filePath, this.value);
  }

  createFileIfNotExist(path: string): void {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '[]');
    }
  }

  createFolderIfNotExist(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
}
