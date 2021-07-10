import fs from 'fs';
import { JsonDb } from './json-db';

beforeAll(() => {
  jest
    .spyOn(fs, 'readFileSync')
    .mockReturnValue(
      '[{ "id": 1, "value":"some_value"}, { "id": 2, "value":"another_value"}]'
    );

  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
});

interface FakeSchema {
  id: number;
  value: string;
}

describe('JsonDbHelper', () => {
  test('getData should return an array of data', () => {
    const sut = new JsonDb<FakeSchema>('valid_file_path');
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
    const sut = new JsonDb<FakeSchema>('valid_file_path');
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
    const sut = new JsonDb<FakeSchema>('valid_file_path');
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
    const sut = new JsonDb<FakeSchema>('valid_file_path');
    sut.save;
  });

  test('update should update values', () => {
    const sut = new JsonDb<FakeSchema>('valid_file_path');

    sut.update({ id: 1 }, { value: 'asdauhsd' });

    expect(sut.virtualData).toEqual([
      { id: 1, value: 'asdauhsd' },
      { id: 2, value: 'another_value' },
    ]);
  });
});
