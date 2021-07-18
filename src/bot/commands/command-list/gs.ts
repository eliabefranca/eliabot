import path from 'path';
const gse = require('general-search-engine');
import { printSite } from 'site-print/dist/index.js';

import { Command, CommandData } from '../protocols/command';
import { CONFIG } from '../../../../config';
import {CommandType} from "../protocols/commandType";
import {outputErrorMessage} from "../../utils/output-error-message";

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
    await outputErrorMessage(client, message, 'Você precisa me enviar a pesquisa')
    return;
  }

  await client.reply(message.from, 'Um momento, já estou procurando.', message.id);

  const { index, text } = getIndexAndTextFromQuery(value);

  const result: GSearchResultItem[] = await new gse.search()
    .setType('search')
    .setQuery(text)
    .run();

  const resultItem = result?.[index];

  if (!resultItem) {
    await outputErrorMessage(client, message, 'Não encontrei nenhum resultado para a sua pesquisa, verifique o index ou o termo digitado')
    return;
  }

  const imgPath = path.join(
    CONFIG.imageDownloadsFolder,
    `${message.sender.id}.png`
  );

  const url = decodeURIComponent(resultItem.link)
    .replace(/\?.*$/, '')
    .replace(/&.*$/, '');

  await printSite({
    url,
    defaultViewport: { width: 500, height: 2500 },
    mobile: true,
    fullPage: false,
    path: imgPath,
    captureBeyondViewport: false,
  });

  await client.sendImage(
    message.from,
    imgPath,
    'result.png',
    `Ta na mão.
  link: ${url}
      `,
    message.id
  );
};

const googleSearch: CommandData = {
  command: '.gs',
  category: CommandType.UTILS,
  func,
  description:
    'Retorna a imagem de um resultado de uma pesquisa no google. Você pode usar a paginação com #N',
};

export default googleSearch;
