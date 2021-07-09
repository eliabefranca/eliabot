export interface DbController<T> {
  get(): Promise<T>;
  save(): Promise<void>;
  update(): Promise<void>;
  delete(): Promise<void>;
}
