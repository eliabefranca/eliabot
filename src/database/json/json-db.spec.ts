import { IFileReader } from '../protocols/file-reader';
import { JsonDb } from './json-db';

interface FakeSchema {
  id: number;
  value: string;
}

class FileReaderStub implements IFileReader {
  value = `[{"id": 1,"value": "some_value"},{"id": 2,"value": "another_value"}]`;

  read(): string {
    return this.value;
  }

  write(value: string): void {
    this.value = value;
  }

  createFileIfNotExist(path: string) {}
  createFolderIfNotExist(path: string) {}
}

interface SutTypes {
  sut: JsonDb<FakeSchema>;
  fileReaderStub: IFileReader;
}

const makeSut = (): SutTypes => {
  const fileReaderStub = new FileReaderStub();

  const sut = new JsonDb<FakeSchema>('valid/json/path', fileReaderStub);

  return { sut, fileReaderStub };
};

describe('JsonDbHelper', () => {
  test('getData should return an array of data', () => {
    const { sut } = makeSut();
    const data = sut.getData();
    expect(data).toEqual([
      {
        id: 1,
        value: 'some_value',
      },
      {
        id: 2,
        value: 'another_value',
      },
    ]);
  });

  test('get should return an array of data', () => {
    const { sut } = makeSut();
    const data = sut.get({ id: 1 });
    const anotherData = sut.get({ value: 'another_value' });

    expect(data).toEqual([
      {
        id: 1,
        value: 'some_value',
      },
    ]);

    expect(anotherData).toEqual([
      {
        id: 2,
        value: 'another_value',
      },
    ]);
  });

  test('getFirst should return a unique item', () => {
    const { sut } = makeSut();
    const data = sut.getFirst({ id: 1 });
    const anotherData = sut.getFirst({ value: 'another_value' });

    expect(data).toEqual({
      id: 1,
      value: 'some_value',
    });

    expect(anotherData).toEqual({
      id: 2,
      value: 'another_value',
    });
  });

  test('save should update this.data', () => {
    const { sut } = makeSut();
    sut.save({ id: 3, value: 'new_inserted_value' });

    expect(sut.virtualData).toEqual([
      { id: 1, value: 'some_value' },
      { id: 2, value: 'another_value' },
      { id: 3, value: 'new_inserted_value' },
    ]);
  });

  test('update should update values', () => {
    const { sut } = makeSut();

    sut.update({ id: 1 }, { value: 'updated_value' });

    expect(sut.virtualData).toEqual([
      { id: 1, value: 'updated_value' },
      { id: 2, value: 'another_value' },
    ]);
  });

  test('updateOrInsert should update or insert ._.', () => {
    const { sut } = makeSut();
    sut.updateOrInsert({ id: 1 }, { value: 'updated_value' });
    sut.updateOrInsert({ id: 3 }, { value: 'new_inserted_value' });

    expect(sut.virtualData).toEqual([
      { id: 1, value: 'updated_value' },
      { id: 2, value: 'another_value' },
      { id: 3, value: 'new_inserted_value' },
    ]);
  });
});
