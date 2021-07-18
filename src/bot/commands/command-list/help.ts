import { getCommandList } from '.';
import { Command, CommandData } from '../protocols/command';

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
  const ita = '_';

  const availableCommands = commandList.filter((command) => !command.hidden);

  availableCommands.forEach((command) => {
    if (command.hidden) {
      return;
    }

    switch (command.category) {
      case 'funny':
        funStr += tableCell(`${command.command}\n${command.description}`);
        break;
      case 'groupManagement':
        groupManageStr += tableCell(
          `${command.command}\n${command.description}`
        );
        break;
      case 'media':
        mediaStr += tableCell(`${command.command}\n${command.description}`);
        break;
      case 'utils':
        utilsStr += tableCell(`${command.command}\n${command.description}`);
        break;
      case 'botStatistics':
        statsStr += tableCell(`${command.command}\n${command.description}`);
        break;
    }
  });

  utilsStr += bottomSpacing;
  groupManageStr += bottomSpacing;
  funStr += bottomSpacing;
  mediaStr += bottomSpacing;

  let finalText = `${sm}${utilsStr}${groupManageStr}${funStr}${mediaStr}${sm}`;

  client.reply(message.from, finalText, message.id);
};

const help: CommandData = {
  command: '.help',
  category: 'utils',
  description: 'Exibe a lista de comandos',
  func,
};

export default help;
