import { CommandData } from 'core/protocols';
import { getCommandList } from 'commands';
import { IClient, Message, ClientEvents } from '../protocols';
import { makeSock, logger } from './baileys';
import makeWASocket, {
  downloadMediaMessage,
  MiscMessageGenerationOptions,
  proto,
} from '@adiwajshing/baileys';
import {
  ClientEventCallBack,
  ClientSendMessageParams,
} from 'core/protocols/client';

let sock: ReturnType<typeof makeWASocket> | null = null;

function getQuotedMessage(
  messageInfo: proto.IWebMessageInfo | undefined | null
) {
  return messageInfo?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
}

function getMessageType(
  messageInfo: proto.IMessage | undefined | null
): Message<proto.IWebMessageInfo>['type'] {
  let type: Message<proto.IWebMessageInfo>['type'] = 'text';

  if (messageInfo?.audioMessage) {
    type = 'audio';
  } else if (messageInfo?.imageMessage) {
    type = 'image';
  } else if (messageInfo?.videoMessage) {
    type = 'video';
  } else if (messageInfo?.documentMessage) {
    type = 'document';
  } else if (messageInfo?.extendedTextMessage) {
    type = 'reply';
  } else if (messageInfo?.contactMessage) {
    type = 'contact';
  } else if (messageInfo?.locationMessage) {
    type = 'location';
  } else if (messageInfo?.stickerMessage) {
    type = 'sticker';
  }

  return type;
}

async function imageOrVideoFromMessage(
  messageInfo: proto.IWebMessageInfo
): Promise<Buffer | undefined> {
  return (await downloadMediaMessage(
    messageInfo,
    'buffer',
    {},
    {
      logger,
      // pass this so that baileys can request a reupload of media
      // that has been deleted
      reuploadRequest: sock!.updateMediaMessage,
    }
  )) as Buffer;
}

async function parseBailesQuotedMessage(
  quotedMessage: proto.IMessage,
  messageInfo: proto.IWebMessageInfo
): Promise<Message<proto.IWebMessageInfo>> {
  const type = getMessageType(quotedMessage);

  let image;
  if (type === 'image') {
    image = await imageOrVideoFromMessage(
      Object.assign({}, messageInfo, { message: quotedMessage })
    );
  }

  let video;
  if (type === 'video') {
    video = await imageOrVideoFromMessage(
      Object.assign({}, messageInfo, { message: quotedMessage })
    );
  }

  return {
    id: '', // todo: maybe we can get the name of the quoted message sender
    chatId: quotedMessage?.chat?.id as string,
    sender: {
      id: '', // todo: maybe we can get the name of the quoted message sender
      name: '', // todo: maybe we can get the name of the quoted message sender
    },
    text: quotedMessage?.conversation ?? '',
    type,
    image,
    video,
  };
}

async function parseBaileysMessage(
  messageInfo: proto.IWebMessageInfo
): Promise<Message<proto.IWebMessageInfo>> {
  const type: Message<proto.IWebMessageInfo>['type'] = getMessageType(
    messageInfo.message
  );

  let text = messageInfo.message?.conversation ?? '';

  let quoted: Message<proto.IWebMessageInfo> | undefined;
  if (type === 'reply') {
    quoted = await parseBailesQuotedMessage(
      getQuotedMessage(messageInfo)!,
      messageInfo
    );
    text = messageInfo.message?.extendedTextMessage?.text ?? text;
  }

  let image;
  const caption = messageInfo.message?.imageMessage?.caption;

  if (type === 'image') {
    image = await imageOrVideoFromMessage(messageInfo);
  }

  let video;
  if (type === 'video') {
    video = await imageOrVideoFromMessage(messageInfo);
  }

  return {
    id: messageInfo.key.id!,
    chatId: messageInfo.key.remoteJid!,
    sender: {
      id: messageInfo.key.participant || messageInfo.key.remoteJid!,
      name: messageInfo.pushName!,
    },
    text,
    type,
    quoted,
    originalDriverMessage: messageInfo,
    image,
    caption,
    video,
  };
}

export class BailesAdapter implements IClient {
  commands: CommandData[] = [];

  async sendMessage(params: ClientSendMessageParams): Promise<void> {
    const baileysAditionalCfg: MiscMessageGenerationOptions = {};

    if (params.quote) {
      baileysAditionalCfg.quoted = params.quote.originalDriverMessage;
    }

    if (params.text) {
      await sock!.sendMessage(
        params.chatId,
        { text: params.text },
        baileysAditionalCfg
      );
      return;
    }

    if (params.image) {
      await sock!.sendMessage(
        params.chatId,
        { image: params.image, caption: params.caption ?? '' },
        baileysAditionalCfg
      );
      return;
    }

    if (params.sticker) {
      await sock!.sendMessage(
        params.chatId,
        { sticker: params.sticker },
        baileysAditionalCfg
      );
      return;
    }
  }

  on<T>(event: ClientEvents, callback: ClientEventCallBack<T>): void {
    if (event === 'message') {
      sock!.ev.on('messages.upsert', async (upsert) => {
        if (upsert.type === 'notify') {
          for (const messageInfo of upsert.messages) {
            if (!messageInfo.key.fromMe) {
              await sock!.readMessages([messageInfo.key]);
              const message = await parseBaileysMessage(messageInfo);
              callback(message as T);
            }
          }
        }
      });
    }
  }

  async start(): Promise<void> {
    console.log('Eliabot started');

    this.commands = await getCommandList();
    sock = await makeSock();
  }
}
