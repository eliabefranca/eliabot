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

  public get virtualData() {
    return this.data;
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

  match(schema: Schema, data: T): boolean {
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

    for (let i = 0; i < this.data.length; i++) {
      let item = this.data[i];

      if (this.match(schema, item)) {
        this.data[i] = Object.assign({}, item, newValues);
      }
    }

    this.updateFile();
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
