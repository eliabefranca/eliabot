import { Bot } from './bot';
import { getTimeStamp } from '../helpers/date';
import { getNumberFromContactId } from '../helpers/get-number-from-contact-id';
import { groupsDb, usersDb, historyDb, userStatsDb } from '../database/json/db';
import { Chat, Client } from '@open-wa/wa-automate';
import { setupMiddlewares } from './middlewares';

const bot = new Bot();

// TODO: move to a helper function
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

// TODO: move to a helper function
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

// TODO: move to a helper function
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

setupMiddlewares(bot);
bot.start();
