import { Command, CommandData, CommandType } from 'src/types/command';
import { imageSearch } from 'src/utils/imageSearch';
import { outputErrorMessage } from 'src/helpers/outputErrorMessage';

const func: Command = async ({ value, client, messageInfo }) => {
  if (!value) {
    await outputErrorMessage(
      client,
      messageInfo,
      'Você precisa me enviar uma imagem 🖼️'
    );
    return;
  }

  let imgUrl = await imageSearch(value)
    .then((url) => url)
    .catch(() => {
      return null;
    });

  if (imgUrl === 'cant resolve') {
    await outputErrorMessage(
      client,
      messageInfo,
      'Não foi possível carregar a imagem do servidor de origem'
    );
    return;
  } else if (imgUrl === 'not found' || imgUrl === null) {
    await outputErrorMessage(
      client,
      messageInfo,
      'Não encontrei nenhum resultado, tente alterar o index'
    );
    return;
  }

  if (!imgUrl) {
    await outputErrorMessage(
      client,
      messageInfo,
      `Não encontrei nenhum resultado de imagem para "${value}"`
    );
    return;
  }

  await client.sendMessage(
    messageInfo.key.remoteJid!,
    { image: { url: imgUrl as string }, caption: imgUrl as string },
    { quoted: messageInfo }
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
