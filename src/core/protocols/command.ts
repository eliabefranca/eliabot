import { IClient } from './client';
import { Message } from './message';

interface CommandParams {
  value: string; // text after the command
  client: IClient;
  message: Message<any>;
}

export type CommandHandler = (params: CommandParams) => Promise<void>;

export interface CommandData {
  keywords: string[];
  handler: CommandHandler;
  description: string;
  category: CommandType;
  allowInGroups: boolean;
  allowInPrivate: boolean;
  allowedUsers?: string | string[];
  hidden?: boolean;
  detailedDescription?: string;
}

export enum CommandType {
  UTILS = 'utils',
  FUNNY = 'funny',
  GROUP_MANAGEMENT = 'groupManagement',
  MEDIA = 'media',
  BOT_STATISTICS = 'botStatistics',
  BOT_ADMINISTRATION = 'botAdministration',
  GAMES = 'games',
}
