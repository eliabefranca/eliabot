import path from 'path';
import fs from 'fs';
const gse = require('general-search-engine');
import { printSite } from 'site-print/dist/index.js';

import { Command, CommandData } from '../protocols/command';
import { CONFIG } from '../../../../config';

interface GSearchResultItem {
  title: string;
  link: string;
  description: string;
}

function getIndexAndTextFromQuery(query: string): {
  index: number;
  text: string;
} {
  let index: number = 0;
  let text = query;

  if (/#\d+$/.test(query)) {
    text = query.split(/#\d+$/)[0].trim();

    index = parseInt(query.match(/#\d+$/)?.[0].replace('#', '') as string);
    index = index <= 0 ? index : index - 1;
  }

  return { index, text };
}

const func: Command = async ({ value, client, message }) => {
  if (!value) {
    client.reply(message.from, 'Você precisa me enviar a pesquisa', message.id);
    return;
  }

  client.reply(message.from, 'Um momento, já estou procurando.', message.id);

  const { index, text } = getIndexAndTextFromQuery(value);

  const result: GSearchResultItem[] = await new gse.search()
    .setType('search')
    .setQuery(text)
    .run();

  const resultItem = result?.[index];

  if (!resultItem) {
    client.reply(
      message.from,
      'Não encontrei nenhum resultado para a sua pesquisa, verifique o index ou o termo digitado',
      message.id
    );
    return;
  }

  const imgPath = path.join(
    CONFIG.imageDownloadsFolder,
    `${message.sender.id}.png`
  );

  await printSite({
    url: resultItem.link,
    defaultViewport: { width: 320, height: 480 },
    mobile: true,
    fullPage: true,
    path: imgPath,
  });

  await client.sendImage(
    message.from,
    imgPath,
    'result.png',
    `Ta na mão.
  link: ${resultItem.link}
      `,
    message.id
  );
};

const googleSearch: CommandData = {
  command: '.gs',
  category: 'utils',
  func,
  description: 'Retorna uma imagem de um resultado de uma pesquisa no google',
  hidden: true,
};

export default googleSearch;
