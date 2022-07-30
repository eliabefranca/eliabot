import { Command, CommandData, CommandType } from '@command-protocols';
import { getImage } from '@utils';
import { outputErrorMessage } from '@bot-utils/output-error-message';

const imageDataURI = require('image-data-uri');

const func: Command = async (params) => {
  const { value, client, message } = params;
  if (!value) {
    await outputErrorMessage(
      client,
      message,
      'Você precisa me enviar uma imagem 🖼️'
    );
    return;
  }

  let imgUrl = await getImage(value)
    .then((url) => url)
    .catch(() => {
      return null;
    });

  if (imgUrl === 'cant resolve') {
    await outputErrorMessage(
      client,
      message,
      'Não foi possível carregar a imagem do servidor de origem'
    );
    return;
  } else if (imgUrl === 'not found' || imgUrl === null) {
    await outputErrorMessage(
      client,
      message,
      'Não encontrei nenhum resultado, tente alterar o index'
    );
    return;
  }

  if (!imgUrl) {
    await outputErrorMessage(
      client,
      message,
      `Não encontrei nenhum resultado de imagem para "${value}"`
    );
    return;
  }

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
  command: ['.img'],
  category: CommandType.MEDIA,
  func,
  description: 'Retorna uma imagem a partir de um texto ou palavra.',
  detailedDescription:
    'Você pode escolher a posição do resultado com "#N" onde N é a posição da imagem.\nEx.: .img cachorro #3 -> Retorna o terceiro resultado da pesquisa para a palavra "cachorro"',

  allowInGroups: true,
  allowInPrivate: true,
};

export default searchImage;
