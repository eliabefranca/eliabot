import { userStatsDb } from '@json-db';
import { MessageEventHandler } from '../protocols/message-event-handler';

export const updateStats: MessageEventHandler = ({ message }) => {
  const { id, pushname: name } = message.sender;
  const userStats = userStatsDb.getFirst({ id });

  if (userStats) {
    userStatsDb.update({ id }, { name, commands: userStats.commands + 1 });
  } else {
    userStatsDb.save({
      id,
      name,
      commands: 1,
    });
  }
};
