import path from 'path';
import { printSite } from 'site-print';

import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '@bot-utils/output-error-message';
import { getSiteImage } from '../../../utils/get-site-image';

const func: Command = async ({ value, client, message }) => {
  if (!value) {
    await outputErrorMessage(client, message, 'Você precisa me enviar uma url');
    return;
  }

  let site = value;

  if (!value.includes('https://')) {
    site = `https://${value}`;
  }

  const siteImageUrl = await getSiteImage(site);

  await client.sendImage(
    message.from,
    siteImageUrl,
    'result.png',
    `Ta na mão.
  link: ${siteImageUrl}
      `,
    message.id
  );
};

const viewSite: CommandData = {
  command: ['.vs'],
  category: CommandType.UTILS,
  func,
  description: '(beta) - Retorna um print de um site especificado',

  allowInGroups: true,
  allowInPrivate: true,
};

export default viewSite;
