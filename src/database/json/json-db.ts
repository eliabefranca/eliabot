import { isEqual } from 'lodash';
import { CONFIG } from '../../../config';
import { IFileReader } from '../protocols/file-reader';

export interface Schema {
  [key: string]: any;
}

export class JsonDb<T extends Schema> {
  private data: T[] = [];
  private path: string;
  private readonly fileReader: IFileReader;

  constructor(storagePath: string, fileReader: IFileReader) {
    this.path = storagePath;
    this.fileReader = fileReader;

    fileReader.createFileIfNotExist(this.path);
    fileReader.createFolderIfNotExist(CONFIG.dbFolder);
    this.init();
  }

  public get virtualData() {
    return this.data;
  }

  private refresh(): void {
    const stringData = this.fileReader.read();
    const jsonData = JSON.parse(stringData) as T[];
    this.data = jsonData;
  }

  getData(): T[] {
    this.refresh();
    return this.data;
  }

  private updateFile(): void {
    this.fileReader.write(JSON.stringify(this.data));
    this.refresh();
  }

  save(data: T): void {
    this.refresh();

    let found = false;
    this.data.forEach((item) => {
      if (isEqual(item, data)) {
        item = data;
        found = true;
      }
    });

    if (!found) {
      this.data.push(data);
    }

    this.updateFile();
  }

  match(schema: Schema, data: T): boolean {
    this.refresh();
    const schemaKeys = Object.keys(schema);

    let matches = 0;
    for (const schemaKey of schemaKeys) {
      if (data[schemaKey] && data[schemaKey] === schema[schemaKey]) {
        matches += 1;
      }
    }

    return matches === schemaKeys.length;
  }

  update(schema: Schema, newValues: Schema): void {
    this.refresh();

    const newData = [...this.data];
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];

      if (this.match(schema, item)) {
        newData[i] = Object.assign({}, item, newValues);
      }
    }

    this.data = newData;
    this.updateFile();
  }

  updateOrInsert(schema: Schema, newValues: Schema): void {
    this.refresh();
    const register = this.getFirst(schema);

    if (register) {
      this.update(schema, newValues);
    } else {
      const newRegister = Object.assign({}, schema, newValues) as T;
      this.save(newRegister);
    }
  }

  private init(): void {
    this.refresh();
  }

  get(schema: Schema | Schema[]): T[] {
    this.refresh();
    const values = this.data.filter((item) => {
      if (schema instanceof Array) {
        return schema.some((sch) => this.match(sch, item));
      }

      return this.match(schema, item);
    });

    return values;
  }

  delete(schema: Schema): void {
    this.refresh();
    const filteredData = this.data.filter((item) => {
      return !this.match(schema, item);
    });

    this.data = filteredData;
    this.updateFile();
  }

  getFirst(schema: Schema): T | null {
    this.refresh();

    for (const item of this.data) {
      if (this.match(schema, item)) {
        return item;
      }
    }

    return null;
  }
}
