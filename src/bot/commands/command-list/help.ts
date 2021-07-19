import { getCommandList } from '.';
import { Command, CommandData, CommandType } from '@command-protocols';

const tableHeader = (str: string): string => {
  return `╔═════════════════
║ ${str}
╠═════════════════`;
};

const tableCell = (str: string): string => {
  return `
╠ ${str}
╚═════════════════`;
};

const bottomSpacing = `\n`;

function buildMenuWithAllCommands(commandList: CommandData[]): string {
  let utilsStr = tableHeader('🧰 Utilitários');
  let funStr = tableHeader('🤡 Divertidos');
  let mediaStr = tableHeader('🖼️ Mídia');
  let groupManageStr = tableHeader('👮 Gerenciar Grupo');
  let statsStr = tableHeader('📊 Estatísticas');

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

  const helpMenuItems = [utilsStr, groupManageStr, funStr, mediaStr, statsStr];

  const finalText = `${sm}${helpMenuItems.join('')}${sm}

  Github: https://github.com/Eliabe45/eliabot`;

  return finalText;
}

function BuildMenuWithAsingleCommand(command: CommandData): string {
  const sm = '```';

  const header = tableHeader(`🔗 ${command.command}`);
  const detailetDescription = command.detailedDescription
    ? `\n\n${command.detailedDescription}`
    : '';
  const body = tableCell(`${command.description}${detailetDescription}`);

  const finalText = `${sm}${header}${body}${sm}

  Github: https://github.com/Eliabe45/eliabot`;

  return finalText;
}

const func: Command = async ({ client, message, value }) => {
  const commandList = await getCommandList();

  if (value) {
    const possibleCommand = value.trim();
    const command = commandList.filter(
      (com) => com.command === possibleCommand
    )[0];

    if (command) {
      client.reply(
        message.from,
        BuildMenuWithAsingleCommand(command),
        message.id
      );
      return;
    }
  }

  const helpMenu = buildMenuWithAllCommands(commandList);
  client.reply(message.from, helpMenu, message.id);
};

const help: CommandData = {
  command: '.help',
  category: CommandType.UTILS,
  description:
    'Exibe a lista de comandos. Você pode usar .help [comando] para ver mais detalhes de um determinado comando.\nEx.: .help .fala',
  func,
};

export default help;
