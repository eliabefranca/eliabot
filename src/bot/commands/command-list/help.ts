import { getCommandList } from '.';
import { Command, CommandData, CommandType } from '@command-protocols';

const tableHeader = (str: string): string => {
  return `╔═════════════════
║ ${str}
╠═════════════════`;
};

const closingTableHeader = (str: string): string => {
  return `╔═════════════════
║ ${str}
╚═════════════════`;
};

const straightTableCell = (str: string): string => {
  return `
║ ${str}
╚═════════════════`;
};

const tableCell = (str: string): string => {
  return `
╠ ${str}
╚═════════════════`;
};

const bottomSpacing = `\n`;

function buildMenuWithAllCommands(commandList: CommandData[]): string {
  let utilsStr = tableHeader('🧰 UTILITÁRIOS');
  let funStr = tableHeader('🤡 DIVERTIDOS');
  let mediaStr = tableHeader('🖼️ MÍDIA');
  let groupManageStr = tableHeader('👮 GERENCIAR GRUPO');
  let statsStr = tableHeader('📊 ESTATÍSTICAS');

  const sm = '```';

  const availableCommands = commandList.filter((command) => !command.hidden);

  availableCommands.forEach((command) => {
    if (command.hidden) {
      return;
    }

    switch (command.category) {
      case CommandType.FUNNY:
        funStr += tableCell(
          `${command.command.join(' | ')}\n${command.description}`
        );
        break;
      case CommandType.GROUP_MANAGEMENT:
        groupManageStr += tableCell(
          `${command.command.join(' | ')}\n${command.description}`
        );
        break;
      case CommandType.MEDIA:
        mediaStr += tableCell(
          `${command.command.join(' | ')}\n${command.description}`
        );
        break;
      case CommandType.UTILS:
        utilsStr += tableCell(
          `${command.command.join(' | ')}\n${command.description}`
        );
        break;
      case CommandType.BOT_STATISTICS:
        statsStr += tableCell(
          `${command.command.join(' | ')}\n${command.description}`
        );
        break;
    }
  });

  utilsStr += bottomSpacing;
  groupManageStr += bottomSpacing;
  funStr += bottomSpacing;
  mediaStr += bottomSpacing;

  const helpMenuItems = [utilsStr, groupManageStr, funStr, mediaStr, statsStr];

  const finalText = `${sm}🤖 Oi,

Você pode digitar ".help .nomecomando" para ver melhor o que eu posso fazer com ele.

${helpMenuItems.join('\n')}${sm}

  Github: https://github.com/Eliabe45/eliabot`;

  return finalText;
}

function BuildMenuWithAsingleCommand(command: CommandData): string {
  const sm = '```';

  const header = closingTableHeader(`🔗 ${command.command.join(' | ')}`);
  const { detailedDescription } = command;
  const bodyContent = !detailedDescription
    ? command.description
    : `${command.description}

${detailedDescription}`;
  const body = straightTableCell(bodyContent);

  const finalText = `${sm}${header}${body}${sm}

  Github: https://github.com/Eliabe45/eliabot`;

  return finalText;
}

const func: Command = async ({ client, message, value }) => {
  const commandList = await getCommandList();

  if (value) {
    let possibleCommand = value.trim();
    if (possibleCommand.charAt(0) !== '.') {
      possibleCommand = `.${possibleCommand}`;
    }
    const command = commandList.filter((com) =>
      com.command.includes(possibleCommand)
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
  command: ['.help', '.h', '.ajuda'],
  category: CommandType.UTILS,
  description:
    'Exibe a lista de comandos. Você pode usar .help [comando] para ver mais detalhes de um determinado comando.\nEx.: .help .fala',
  func,
};

export default help;
