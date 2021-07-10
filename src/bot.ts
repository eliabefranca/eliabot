import * as wa from '@open-wa/wa-automate';
import {
  Chat,
  Client,
  Message,
  NotificationLanguage,
} from '@open-wa/wa-automate';
import { execCommand } from './commands';

type MessageEventHandler = (
  client: Client,
  message: Message,
  query: string
) => void;
type EventTypes = 'commandReceived';

export class Bot {
  client: Client | null = null;
  private commandReceivedEvents = [] as MessageEventHandler[];

  on(event: EventTypes, func: MessageEventHandler) {
    if (event === 'commandReceived') {
      this.commandReceivedEvents.push(func);
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
    let isAcommand =
      message?.body?.charAt(0) === '.' || message?.caption?.charAt(0) === '.';
    let query = message.body;

    if (message?.caption?.charAt(0) === '.') {
      query = message.caption;
    }

    if (isAcommand) {
      this.commandReceivedEvents.forEach((func) => {
        func(client, message, query);
      });
      execCommand({ message, client, query });
    }
  }

  private async handleOnAddedToGroup(
    chat: Chat,
    client: Client
  ): Promise<void> {}
}
