import * as wa from '@open-wa/wa-automate';
import {
  Chat,
  Client,
  Message,
  NotificationLanguage,
} from '@open-wa/wa-automate';
import { getCommandData, handleCommand } from './helpers/command';
import { CommandData } from './commands/protocols';
import { updateUser } from './helpers/update-user';
import { updateStats } from './helpers/update-stats';
import { updateGroup } from './helpers/update-group';

export interface CommandMiddlewareParams {
  commandData: CommandData;
  client: Client;
  message: Message;
  query: string;
}

export type CommandMiddleware = (
  params: CommandMiddlewareParams
) => Promise<boolean>;

export class Bot {
  client: Client | null = null;
  private commandMiddlewares = [] as CommandMiddleware[];

  useMiddleware(func: CommandMiddleware): void {
    this.commandMiddlewares.push(func);
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
      restartOnCrash: true,
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

    const commandData = await getCommandData(query);

    if (commandData === null && message.quotedMsg && message.quotedMsg.fromMe) {
      const newQuery = `.c ${query}`;

      handleCommand({
        query: newQuery,
        message,
        client,
        commandData: (await getCommandData(newQuery))!,
      });
      return;
    }

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

    updateUser({ message, client, query });
    updateGroup({ message, client, query });

    if (success) {
      updateStats({ message, client, query });
    }
  }

  private async handleOnAddedToGroup(
    chat: Chat,
    client: Client
  ): Promise<void> {}
}
