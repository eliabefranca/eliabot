import * as wa from '@open-wa/wa-automate';
import {
  Chat,
  Client,
  Message,
  NotificationLanguage,
} from '@open-wa/wa-automate';
import { userStatsDb } from '../database/json/db';
import { handleCommand } from './helpers/command';

type MessageEventHandler = (
  client: Client,
  message: Message,
  query: string
) => void;

type GroupAddEventHandler = (chat: Chat, client: Client) => void;

type EventTypes = 'addedToGroup' | 'commandSuccess';
type EventHandler = GroupAddEventHandler | MessageEventHandler;

export class Bot {
  client: Client | null = null;
  private commandSuccessEvents = [] as MessageEventHandler[];
  private groupAddEvents = [] as GroupAddEventHandler[];

  on(event: EventTypes, func: EventHandler): void {
    if (event === 'addedToGroup') {
      this.groupAddEvents.push(func as GroupAddEventHandler);
      return;
    }

    if (event === 'commandSuccess') {
      this.commandSuccessEvents.push(func as MessageEventHandler);
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

    this.setWaEvents();
  }

  private setWaEvents(): void {
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

    const success = await handleCommand({ query, message, client });

    if (success) {
      this.commandSuccessEvents.forEach((func) => {
        func(client, message, query);
      });
    }
  }

  private async handleOnAddedToGroup(
    chat: Chat,
    client: Client
  ): Promise<void> {}
}
