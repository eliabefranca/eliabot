import { userStatsDb } from '../../database/json/db';
import { MessageEventHandler } from '../protocols/message-event-handler';

export const updateStats: MessageEventHandler = ({ message }) => {
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
};
