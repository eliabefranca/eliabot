import fs from 'fs';
import { isEqual } from 'lodash';

export interface Schema {
  [key: string]: any;
}

export class JsonDb<T extends Schema> {
  private data: T[] = [];
  private path: string;

  constructor(storagePath: string) {
    this.path = storagePath;

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '[]');
    }

    this.init();
  }

  getData(): T[] {
    const stringData = fs.readFileSync(this.path, { encoding: 'utf-8' });
    const jsonData = JSON.parse(stringData) as T[];
    return jsonData;
  }

  private refresh(): void {
    this.data = this.getData();
  }

  private updateFile(): void {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
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

  private init(): void {
    this.refresh();
  }

  get(schema: Schema): T[] {
    this.refresh();

    const schemaKeys = Object.keys(schema);

    const values = this.data.filter((item) => {
      for (const schemaKey of schemaKeys) {
        if (item[schemaKey] && item[schemaKey] === schema[schemaKey]) {
          return true;
        }
      }

      return false;
    });

    return values;
  }

  delete(schema: Schema): void {
    this.refresh();

    const schemaKeys = Object.keys(schema);

    const filteredData = this.data.filter((item) => {
      for (const schemaKey of schemaKeys) {
        if (item[schemaKey] && item[schemaKey] === schema[schemaKey]) {
          return false;
        }
      }

      return true;
    });

    this.data = filteredData;
    this.updateFile();
  }

  getFirst(schema: Schema): T | null {
    this.refresh();

    const schemaKeys = Object.keys(schema);

    for (const item of this.data) {
      for (const schemaKey of schemaKeys) {
        if (item[schemaKey] && item[schemaKey] === schema[schemaKey]) {
          return item;
        }
      }
    }

    return null;
  }
}
