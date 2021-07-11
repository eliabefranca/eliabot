import { Bot } from './bot';
import { getTimeStamp } from '../helpers/date';
import { getNumberFromContactId } from '../helpers/get-number-from-contact-id';
import { groupsDb, usersDb, historyDb } from '../database/json/db';
import { Chat, Client } from '@open-wa/wa-automate';

const bot = new Bot();

bot.on('commandReceived', (client, message, query) => {
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
