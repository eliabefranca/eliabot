import * as wa from '@open-wa/wa-automate';
import {
  Chat,
  Client,
  Message,
  NotificationLanguage,
} from '@open-wa/wa-automate';
import { getCommandData, handleCommand } from './helpers/command';
import { CommandData } from './commands/protocols/command';
import { getCommandList } from './commands/command-list';

type MessageEventHandler = (
  client: Client,
  message: Message,
  query: string
) => void;

interface CommandMiddlewareParams {
  commandData: CommandData;
  client: Client;
  message: Message;
  query: string;
}

interface groupMiddlewareParams {
  client: Client;
  chat: Chat;
  message: Message;
}

type CommandMiddleware = (params: CommandMiddlewareParams) => Promise<boolean>;
type GroupAddEventHandler = (chat: Chat, client: Client) => void;

type EventTypes = 'addedToGroup' | 'commandSuccess' | 'commandReceived';
type EventHandler = GroupAddEventHandler | MessageEventHandler;

export class Bot {
  client: Client | null = null;
  private commandSuccessEvents = [] as MessageEventHandler[];
  private commandMiddlewares = [] as CommandMiddleware[];
  private groupAddEvents = [] as GroupAddEventHandler[];

  useMiddleware(func: CommandMiddleware): void {
    this.commandMiddlewares.push(func);
  }

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

    if (typeof query !== 'string') {
      return;
    }

    const commandData = await getCommandData(query);
    if (commandData === null) {
      return;
    }

    let shouldContinue = true;

    for (const middleware of this.commandMiddlewares) {
      const success = await middleware({ commandData, message, query, client });
      if (!success) {
        shouldContinue = false;
        break;
      }
    }

    if (!shouldContinue) {
      return;
    }

    const success = await handleCommand({
      query,
      message,
      client,
      commandData,
    });

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
