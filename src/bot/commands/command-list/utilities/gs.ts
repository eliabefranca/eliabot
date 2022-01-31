import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '@bot-utils/output-error-message';
import { getSiteImage } from '@bot-utils/get-site-image';

// TODO: move this to a util file
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
    await outputErrorMessage(
      client,
      message,
      'Você precisa me enviar a pesquisa'
    );
    return;
  }

  await client.reply(
    message.from,
    'Um momento, já estou procurando.',
    message.id
  );

  const siteImage = await getSiteImage(
    encodeURI(`https://google.com/search?q=${value}`)
  );

  await client.sendImage(
    message.from,
    siteImage,
    'result.png',
    `Ta na mão.
  link: ${siteImage}
      `,
    message.id
  );
};

const googleSearch: CommandData = {
  command: ['.gs'],
  category: CommandType.UTILS,
  func,
  description:
    '(beta) - Retorna a imagem de um resultado de uma pesquisa no google.',

  allowInGroups: true,
  allowInPrivate: true,
};

export default googleSearch;
