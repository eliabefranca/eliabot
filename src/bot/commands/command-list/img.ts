import { Client } from '@open-wa/wa-automate';
import axios from 'axios';
import { Command, CommandData } from '../protocols/command';
const gis = require('g-i-s');
const imageDataURI = require('image-data-uri');

const getImage = async (term: string) => {
  return new Promise((resolve, reject) => {
    let index: number;
    let text = term;

    if (/#\d+$/.test(term)) {
      text = term.split(/#\d+$/)[0].trim();

      index = parseInt(term.match(/#\d+$/)?.[0].replace('#', '') as string);
      index = index <= 0 ? index : index - 1;
    }

    if (text)
      gis(text, async (error: any, results: any[]) => {
        if (error || !results || !results[0]) {
          reject(false);
        }

        if (index) {
          const image = results[index];
          if (image) {
            const headers = await axios
              .get(image.url)
              .then((resp) => resp.headers)
              .catch(() => false);

            if (!headers || headers['content-type'] === 'text/html') {
              resolve('cant resolve');
            }
            resolve(image.url);
          } else {
            resolve('not found');
          }
        }

        try {
          for (const image of results) {
            const headers = await axios
              .get(image.url)
              .then((resp) => resp.headers)
              .catch(() => false);

            if (headers && headers['content-type'] !== 'text/html') {
              resolve(image.url);
              break;
            }
          }
        } catch (e) {
          resolve(false);
        }
      });
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
      'Cê precisa enviar o nome da imagem, bocó!',
      message.id
    );
    return;
  }

  let imgUrl = await getImage(value)
    .then((url) => url)
    .catch((results) => {
      // client.sendText(message.from, `--${JSON.stringify(results)}`);
      return false;
    });

  if (imgUrl === 'cant resolve') {
    await client.reply(
      message.from,
      'Não foi possível carregar a imagem do servidor de origem',
      message.id
    );
    return;
  } else if (imgUrl === 'not found') {
    await client.reply(
      message.from,
      'Não encontrei nenhum resultado, tente alterar o index',
      message.id
    );
    return;
  }

  if (!imgUrl) {
    await client.reply(
      message.from,
      `Não encontrei nenhum resultado de imagem para "${value}"`,
      message.id
    );
    return;
  }

<<<<<<< HEAD

=======
>>>>>>> 417a76f2db609e8c56bdeed5fecd66075127d57c
  const imageName = imgUrl as string;
  const dataUri = await imageDataURI.encodeFromURL(imgUrl);

  await client.sendImage(
    message.from,
    dataUri,
    imageName,
    `Ta na mão.
link: ${imgUrl}
    `,
    message.id
  );
};

const searchImage: CommandData = {
  command: '.img',
  category: 'media',
  func,
  description:
    'Retorna uma imagem a partir de um term. Você pode escolher a posição do resultado com "#N" onde N é a posição da imagem.',
};

export default searchImage;
