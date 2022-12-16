import makeWASocket, { proto } from '@adiwajshing/baileys';

export enum CommandType {
  UTILS = 'utils',
  FUNNY = 'funny',
  GROUP_MANAGEMENT = 'groupManagement',
  MEDIA = 'media',
  BOT_STATISTICS = 'botStatistics',
  BOT_ADMINISTRATION = 'botAdministration',
  GAMES = 'games',
}

export interface CommandData {
  command: string[];
  description: string;
  func: Command;
  category: CommandType;
  allowInGroups: boolean;
  allowInPrivate: boolean;
  allowedUsers?: string | string[];
  hidden?: boolean;
  detailedDescription?: string;
}

export interface CommandParams {
  client: ReturnType<typeof makeWASocket>;
  messageInfo: proto.IWebMessageInfo;
  value?: string;
  fromQuoted?: boolean;
}

export type Command = (params: CommandParams) => Promise<void>;
