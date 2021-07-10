import { Client, Message } from '@open-wa/wa-automate';

export interface CommandData {
  command: string;
  description: string;
  func: Command;
  onlyForGroups?: boolean;
  allowedUsers?: string; // TODO: add roles
  hidden?: boolean;
}

export interface CommandParams {
  client: Client;
  message: Message;
  value?: string;
}

export type Command = (params: CommandParams) => Promise<void>;
