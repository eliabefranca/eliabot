import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandom, getImage } from '@utils';
import { getRandomContactNumber } from '@bot-utils';

const imageDataURI = require('image-data-uri');

const names = [
  'Felipe Neto',
  'Fausto Silva',
  'Renato Aragão',
  'Leão Lobo',
  'Leno Brega',
  'Ronald Mcdonald',
  'Carlos Bolsonaro',
  'Renan Bolsonaro',
  'Eduardo Bolsonaro',
  'Jair Messias Bolsonaro',
  'Lula',
  'Mãmãe Falei',
  'Sósia do Ronaldinho',
  'Tio Sam',
  'Ana Maria Braga',
  'Pedro Bial',
  'Luciano Huck',
  'Eevee',
  'Fátima Bernardes',
  'Ednaldo Pereira',
  'Agostinho Carrara',
  'Dona Nenê',
  'Glória Maria do Fantástico',
  'Joelma do Calypso',
  'Galerito',
  'Gil da Esfiha',
  'Cr7 de Facão',
  'Vampeta',
  'Gil do BBB21',
  'Messi Careca',
  'Juliette do BBB21',
  'Monark',
  'Véio da Havan',
  'Sonia Abrão',
  'Felipe Dylon',
  'Nunes Filho',
  'Galo Cego',
  'Sua Mãe',
  'Padre Marcelo Rossi',
  'Galo de Kalsa',
  'Galo de Tênis',
  'Datena',
  'Lázaro Barbosa do DF',
  'Macaco Twelves do Latino',
  'Vanessão 20 Reais',
  'Bicha Muda',
  'Bluezão',
  'Kid Bengala',
  'Henri Cristo',
  'Beyonce',
  'Nando Moura Anão',
];

const func: Command = async ({ message, client, value }) => {

  const marriagePartner = getRandom(names);

  const contactNumber = await getRandomContactNumber(client, message, false);

  let imgUrl = await getImage(marriagePartner)
    .then((url) => url)
    .catch(() => {
      return false;
    });

  const imageName = imgUrl as string;
  const dataUri = await imageDataURI.encodeFromURL(imgUrl);

  await client.sendImage(
    message.from,
    dataUri,
    imageName,
    `💑 O 💍 casamento 💍 entre @${contactNumber} e *${marriagePartner}* está prestes a acontecer, vamos desejar felicidades ao casal. ✨ ✨ ✨`,
    message.id
  );
};

const marry: CommandData = {
  command: ['.marry'],
  category: CommandType.FUNNY,
  description:
    'Um casamento aleatorio entre um membro do grupo e um personagem de anime',
  func,
  allowInGroups: true,
  allowInPrivate: false,
};

export default marry;
