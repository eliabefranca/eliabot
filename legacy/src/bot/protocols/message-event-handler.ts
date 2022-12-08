import { Client, Message } from '@open-wa/wa-automate';

export interface MessageEventHandlerParams {
  client: Client;
  message: Message;
  query: string;
}
export type MessageEventHandler = (params: MessageEventHandlerParams) => void;
