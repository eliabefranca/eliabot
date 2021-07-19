import { getCommandList } from '.';
import { Command, CommandData, CommandType } from '../protocols';

const tableHeader = (str: string): string => {
  return `╔═════════════════
║ 📂 ${str}
╠═════════════════`;
};

const tableCell = (str: string): string => {
  return `
╠ ${str}
╚═════════════════`;
};

const bottomSpacing = `\n`;

const func: Command = async ({ client, message }) => {
  const commandList = await getCommandList();
  let utilsStr = tableHeader('Utilitários');
  let funStr = tableHeader('Divertidos');
  let mediaStr = tableHeader('Mídia');
  let groupManageStr = tableHeader('Gerenciar Grupo');
  let statsStr = tableHeader('Estatísticas');

  const sm = '```';

  const availableCommands = commandList.filter((command) => !command.hidden);

  availableCommands.forEach((command) => {
    if (command.hidden) {
      return;
    }

    switch (command.category) {
      case CommandType.FUNNY:
        funStr += tableCell(`${command.command}\n${command.description}`);
        break;
      case CommandType.GROUP_MANAGEMENT:
        groupManageStr += tableCell(
          `${command.command}\n${command.description}`
        );
        break;
      case CommandType.MEDIA:
        mediaStr += tableCell(`${command.command}\n${command.description}`);
        break;
      case CommandType.UTILS:
        utilsStr += tableCell(`${command.command}\n${command.description}`);
        break;
      case CommandType.BOT_STATISTICS:
        statsStr += tableCell(`${command.command}\n${command.description}`);
        break;
    }
  });

  utilsStr += bottomSpacing;
  groupManageStr += bottomSpacing;
  funStr += bottomSpacing;
  mediaStr += bottomSpacing;

  let finalText = `${sm}${utilsStr}${groupManageStr}${funStr}${mediaStr}${sm}

  Github: https://github.com/Eliabe45/eliabot`;

  client.reply(message.from, finalText, message.id);
};

const help: CommandData = {
  command: '.help',
  category: CommandType.UTILS,
  description: 'Exibe a lista de comandos',
  func,
};

export default help;
