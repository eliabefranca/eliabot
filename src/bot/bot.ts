import * as wa from '@open-wa/wa-automate';
import {
  Chat,
  Client,
  Message,
  NotificationLanguage,
} from '@open-wa/wa-automate';
import { handleCommand } from './helpers/command';

type MessageEventHandler = (
  client: Client,
  message: Message,
  query: string
) => void;

type GroupAddEventHandler = (chat: Chat, client: Client) => void;

type EventTypes = 'commandReceived' | 'addedToGroup';
type EventHandler = GroupAddEventHandler | MessageEventHandler;

export class Bot {
  client: Client | null = null;
  private commandReceivedEvents = [] as MessageEventHandler[];
  private groupAddEvents = [] as GroupAddEventHandler[];

  on(event: EventTypes, func: EventHandler): void {
    if (event === 'commandReceived') {
      this.commandReceivedEvents.push(func as MessageEventHandler);
      return;
    }

    if (event === 'addedToGroup') {
      this.groupAddEvents.push(func as GroupAddEventHandler);
      return;
    }
  }

  async start(): Promise<void> {
    this.client = await wa.create({
      sessionId: 'ELIABOT',
      authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: NotificationLanguage.PTBR,
      useChrome: true,
      logConsole: false,
      popup: false,
      qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
      restartOnCrash: false,
      killProcessOnBrowserClose: true,
    });

    this.setEvents();
  }

  private setEvents(): void {
    if (!this.client) {
      return;
    }

    const client = this.client as Client;

    this.client.onMessage((message) => this.handleOnMessage(message, client));
    this.client.onAddedToGroup((chat) =>
      this.handleOnAddedToGroup(chat, client)
    );
  }

  private async handleOnMessage(
    message: Message,
    client: Client
  ): Promise<void> {
    let query = message.body;

    if (message.isMedia) {
      query = message.caption ?? '';
    }

    handleCommand({ query, message, client });
  }

  private async handleOnAddedToGroup(
    chat: Chat,
    client: Client
  ): Promise<void> {}
}
