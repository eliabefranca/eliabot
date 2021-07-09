import { Client, Message } from '@open-wa/wa-automate';

export interface CommandData {
  command: '.p';
  description: string;
  func: Command;
}

export interface CommandParams {
  client: Client;
  message: Message;
  value?: string;
}

export type Command = (params: CommandParams) => void;
