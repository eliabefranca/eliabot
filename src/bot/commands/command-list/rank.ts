import { userStatsDb } from '../../../database/json/db';
import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ client, message }) => {
  const schemaList = message.chat.groupMetadata.participants.map(
    (participant) => ({ id: participant.id })
  );

  let rank = await userStatsDb.get(schemaList);

  if (rank.length === 0) {
    client.reply(
      message.from,
      'Este grupo ainda não tem ninguém nas estatísticas',
      message.id
    );
    return;
  }

  let msg = `*Usuários mais ativos*\n\n`;

  rank = rank.sort((userA, userB) => {
    if (userA.commands >= userB.commands) {
      return -1;
    }
    return 1;
  });

  rank = rank.slice(0, 10);

  rank.forEach((user, index) => {
    let m = index === 0 ? '🏆' : '';
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

    msg += `${w}${m} ${index + 1} - ${user.name}${w} (${user.commands} comando${
      user.commands > 1 ? 's' : ''
    }) \n`;
  });

  await client.reply(message.from, msg, message.id);
};

const stats: CommandData = {
  command: '.rank',
  func,
  category: 'botStatistics',
  description: 'Exibe o ranking dos usuários que mais utilizam o bot no grupo.',
  hidden: false,
  onlyForGroups: true,
};

export default stats;
