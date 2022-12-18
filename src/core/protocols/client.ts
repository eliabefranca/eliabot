import { Message, CommandData } from '.';

export type ClientEvents = 'message' | 'presence';
export type ClientEventCallBack<T> = (arg: T) => Promise<void> | void;

export interface ClientSendMediaData {
  url?: string;
  buffer?: Buffer;
  caption?: string;
}

interface Button {
  id: string;
  displayText: string;
  url?: string;
  phoneNumber?: string;
  [key: string]: any;
}

export interface ClientSendMessageParams {
  chatId: string;
  text?: string;
  sticker?: Buffer;
  image?: ClientSendMediaData;
  caption?: string;
  video?: ClientSendMediaData;
  quote?: Message<any>;
  originalDriverMessage?: any;
  buttons?: Button[];
}

export type RegisteredCallback = (params: any) => Promise<void> | void;
export interface IClient {
  commands: CommandData[];

  sendMessage(params: ClientSendMessageParams): Promise<void>;
  on<T>(
    event: ClientEvents,
    callback: ClientEventCallBack<T>
  ): RegisteredCallback;
  off(event: ClientEvents, callback: RegisteredCallback): void;

  start(): Promise<void>;
}
