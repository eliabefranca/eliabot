import { Command, CommandData, CommandType } from '@command-protocols';
import axios from 'axios';
import { outputErrorMessage } from '../../../utils/output-error-message';
import { getRandomInterval } from '@utils';

const imageDataURI = require('image-data-uri');

const func: Command = async (params) => {
  const { value, client, message } = params;
  let pokemonQuery = value;

  if (pokemonQuery && typeof pokemonQuery === 'string') {
    pokemonQuery = pokemonQuery.toLowerCase();
  }

  const response = await axios
    .get(
      'https://pokeapi.co/api/v2/pokemon/' +
        (pokemonQuery ? pokemonQuery : getRandomInterval(1, 898))
    )
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error) => error);

  if (response.status == 404) {
    await outputErrorMessage(
      client,
      message,
      `Não encontrei nenhum resultado de pokemon para "${value}". Tente usar o nome de um pokemon ou seu id entre 1 e 898`
    );
    return;
  }

  const pokemonName = (await response.species.name) as string;
  const imageName = (await response.sprites.front_default) as string;
  const dataUri = await imageDataURI.encodeFromURL(imageName);

  await client.sendImage(
    message.from,
    dataUri,
    imageName,
    `Ta na mão seu ` + pokemonName + `.`,
    message.id
  );
};

const pokemon: CommandData = {
  command: ['.pokemon','.pk'],
  category: CommandType.MEDIA,
  func,
  description: 'Retorna um pokemon.',
  detailedDescription:
    'Você pode escolher o numero da Pokedex com "#N" onde N é o número do pokemon .\nEx.: .po  #4 -> Retorna charmander',
  allowInGroups: true,
  allowInPrivate: true,
};

export default pokemon;
