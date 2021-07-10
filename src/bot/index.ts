import { Bot } from './bot';
import { getCommands } from './commands/command-list';
import { getTimeStamp } from '../helpers/date';
import { getNumberFromContactId } from '../helpers/get-number-from-contact-id';
import { blockedUsersDb, usersDb, historyDb } from '../database/json/db';
import { ChatMuteDuration } from '@open-wa/wa-automate';

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

    console.log(message.sender);
    usersDb.save(user);
  }

  historyDb.save({
    user,
    message: query,
    chat: message.chat.name,
    created_at: getTimeStamp(),
    updated_at: getTimeStamp(),
  });
});

bot.start();

getCommands();
