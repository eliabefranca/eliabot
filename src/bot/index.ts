import { Bot } from './bot';
import { getTimeStamp } from '../helpers/date';
import { getNumberFromContactId } from '../helpers/get-number-from-contact-id';
import {
  groupsDb,
  usersDb,
  historyDb,
  userStatsDb,
  blockedUsersDb,
  blockedGroupsDb,
} from '../database/json/db';
import { Chat, Client } from '@open-wa/wa-automate';

const bot = new Bot();

bot.on('commandSuccess', (client, message, query) => {
  let user = usersDb.getFirst({ id: message.sender.id });

  if (!user) {
    user = {
      id: message.sender.id,
      name: message.sender.pushname,
      number: getNumberFromContactId(message.sender.id),
      profilePic: message.sender.profilePicThumbObj.eurl,
    };

    usersDb.save(user);
  }

  const { chat } = message;

  if (query !== '.') {
    historyDb.save({
      user,
      message: query,
      chat: {
        id: chat.id,
        isGroup: chat.isGroup,
        name: chat.name,
      },
      created_at: getTimeStamp(),
      updated_at: getTimeStamp(),
    });
  }
});

// moderator  middleware
bot.useMiddleware(
  async ({ commandData, client, message, query }): Promise<boolean> => {
    if (!commandData.allowedUsers) {
      return true;
    }

    if (commandData.allowedUsers.includes('moderator')) {
      const user = usersDb.getFirst({ id: message.sender.id });

      if (user?.role === 'admin' || user?.role === 'moderator') {
        return true;
      }

      await client.reply(
        message.from,
        'Este comando é apenas para moderadores e administradores.',
        message.id
      );
      return false;
    }

    return true;
  }
);

// blocked users middleware
bot.useMiddleware(async ({ client, message }): Promise<boolean> => {
  const blockedUser = blockedUsersDb.getFirst({ userId: message.sender.id });

  if (blockedUser) {
    await client.reply(message.from, 'Usuário bloqueado.', message.id);
    return false;
  }

  return true;
});

// blocked groups middleware
bot.useGroupMiddleware(async ({ client, chat, message }): Promise<boolean> => {
  const blockedGroup = blockedGroupsDb.getFirst({ groupId: chat.id });

  if (blockedGroup) {
    // await client.reply(message.from, 'Grupo bloqueado.', message.id);
    return false;
  }

  return true;
});

bot.on('commandSuccess', (client, message, query) => {
  const userStats = userStatsDb.getFirst({ id: message.sender.id });

  if (userStats) {
    userStatsDb.update(userStats, { commands: userStats.commands + 1 });
  } else {
    userStatsDb.save({
      id: message.sender.id,
      name: message.sender.pushname,
      commands: 1,
    });
  }
});

bot.on('addedToGroup', (chat: Chat, client: Client) => {
  let group = groupsDb.getFirst({ id: chat.id });

  if (!group) {
    groupsDb.save({
      id: chat.id,
      name: chat.name,
      thumb: chat.contact.profilePicThumbObj.eurl,
    });
  }
});

bot.start();
