import { Command, CommandData, CommandType } from '@command-protocols';
import { CONFIG } from 'config';

const func: Command = async ({ client, message }) => {
  await client
    .getPage()
    .screenshot({
      path: `${CONFIG.screenshotsFolder}/view-group.png`,
    })
    .then(() => {
      client.sendImage(
        message.from,
        `${CONFIG.screenshotsFolder}/view-group.png`,
        'group-screenshot',
        ''
      );
    });
};

const viewWindow: CommandData = {
  func,
  description: 'Mostra um print da janela',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.viewwindow', '.vw'],
  allowedUsers: 'admin',
};

export default viewWindow;
