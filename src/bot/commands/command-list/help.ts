import { getCommandList } from '.';
import { Command, CommandData } from '../protocols/command';

const func: Command = async ({ client, message }) => {
  const commandList = await getCommandList();

  let msg = '*Comandos gerais*\n\n';

  const sm = '```';
  const ita = '_';

  let groupMsg = `*Comandos específicos para grupos*\n\n`;

  const availableCommands = commandList.filter((command) => !command.hidden);

  availableCommands.forEach((command) => {
    if (command.onlyForGroups) {
      groupMsg += `${sm + command.command + sm}: ${
        ita + command.description + ita
      } \n\n`;
    } else {
      msg += `${sm + command.command + sm}: ${
        ita + command.description + ita
      } \n\n`;
    }
  });

  client.reply(message.from, msg + groupMsg, message.id);
};

const help: CommandData = {
  command: '.help',
  description: 'Exibe a lista de comandos',
  func,
};

export default help;
