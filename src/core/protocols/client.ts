import { Message, CommandData } from '.';

export type ClientEvents = 'message' | 'presence';
export type ClientEventCallBack<T> = (arg: T) => Promise<void> | void;

export interface ClientSendMessageImageData {
  url?: string;
  buffer?: Buffer;
  caption?: string;
}

export interface ClientSendMessageParams {
  chatId: string;
  text?: string;
  sticker?: Buffer;
  image?: ClientSendMessageImageData;
  caption?: string;
  video?: Buffer;
  quote?: Message<any>;
  originalDriverMessage?: any;
}

export interface IClient {
  commands: CommandData[];
  sendMessage(params: ClientSendMessageParams): Promise<void>;

  on<T>(event: ClientEvents, callback: ClientEventCallBack<T>): void;

  start(): Promise<void>;
}
