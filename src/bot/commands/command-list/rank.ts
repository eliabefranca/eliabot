import { userStatsDb } from '@json-db';
import { Command, CommandData, CommandType } from '@command-protocols';

const func: Command = async ({ client, message }) => {
  let rank = await userStatsDb.getData();

  let msg = `*Usuários mais ativos*\n\n`;

  rank = rank.sort((userA, userB) => {
    if (userA.commands >= userB.commands) {
      return -1;
    }
    return 1;
  });

  rank = rank.slice(0, 20);

  rank.forEach((user, index) => {
    let m: string;
    const w = '```';

    if (index === 0) {
      m = '🥇';
    } else if (index === 1) {
      m = '🥈';
    } else if (index === 2) {
      m = '🥉';
    } else {
      m = '🎖️';
    }

    let { name, commands } = user;
    name = name ?? '<sem nome/>';
    msg += `${w}${m} ${index + 1} - ${name}${w} (${commands} comando${
      user.commands > 1 ? 's' : ''
    }) \n`;
  });

  await client.reply(message.from, msg, message.id);
};

const stats: CommandData = {
  command: '.rank',
  func,
  category: CommandType.BOT_STATISTICS,
  description: 'Exibe o ranking dos usuários que mais utilizam o bot.',
  hidden: false,
  onlyForGroups: true,
};

export default stats;
