import { Command, CommandData } from '../protocols/command';
import giphyApi from 'giphy-api';

const giphy = giphyApi();

const getGif = async (term: string) => {
  return new Promise((resolve, reject) => {
    const RANDOM_POOL = 50;

    let index: number = 0;
    let text = term;

    if (/#\d+$/.test(term)) {
      text = term.split(/#\d+$/)[0].trim();

      index = parseInt(term.match(/#\d+$/)?.[0].replace('#', '') as string);
      index = index <= 0 ? index : index - 1;
    } else if (/#R$/i.test(term)) {
      text = term.split(/#R$/i)[0].trim();
      index = Math.floor(Math.random() * RANDOM_POOL);
    }

    const fetchGif = (gif: giphyApi.GIFObject) => {
      const src = gif && gif.images.original.url;
      src ? resolve(src.replace(/media\d+/, "media")) : resolve('not found');
    };

    if (text) {
      giphy.search(
        {
          q: text,
          offset: index,
          limit: 1,
          rating: "r"
        },
        (_err, res) => fetchGif(res.data[0])
      );
    }
  }).catch((error) => {
    console.log(error);
    return false;
  });
};

const func: Command = async (params) => {
  const { value, client, message } = params;

  if (!value) {
    await client.reply(
      message.from,
      'Cê precisa enviar o nome do gif, bocó!',
      message.id
    );
    return;
  }

  let gifUrl = await getGif(value)
    .then((url) => url)
    .catch((results) => {
      // client.sendText(message.from, `--${JSON.stringify(results)}`);
      return false;
    });

  if (gifUrl === 'cant resolve') {
    await client.reply(
      message.from,
      'Não foi possível carregar o gif do servidor de origem',
      message.id
    );
    return;
  } else if (gifUrl === 'not found') {
    await client.reply(
      message.from,
      'Não encontrei nenhum resultado, tente alterar o index',
      message.id
    );
    return;
  }

  if (!gifUrl) {
    await client.reply(
      message.from,
      `Não encontrei nenhum resultado de gif para "${value}"`,
      message.id
    );
    return;
  }

  const gifName = gifUrl as string;

  await client.sendGiphy(
    message.from,
    gifName,
    `Ta na mão.
link: ${gifUrl}
    `,
  ).catch((err) => client.reply(
    message.from,
    `Deu ruim aqui, peço perdão pelo vacilo`,
    message.id
  ));
};

const searchGif: CommandData = {
  command: '.gif',
  func,
  description:
    'Retorna um GIF a partir de um term. Você pode escolher a posição do resultado com "#N" onde N é a posição do gif. Utilizar a posição #R retornará um gif aleatório.',
};

export default searchGif;
