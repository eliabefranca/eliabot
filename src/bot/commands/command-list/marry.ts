import { Client } from '@open-wa/wa-automate';
import axios from 'axios';
import { getNumberFromContactId } from '../../../helpers/get-number-from-contact-id';
import { Command, CommandData } from '../protocols/command';
const gis = require('g-i-s');
const imageDataURI = require('image-data-uri');

const names = [
  'Maki Zenin',
  'Satoru Gojo',
  'Nico Robin',
  'Sanji Vinsmoke',
  'Yuta Okkotsu',
  'Megumi Fushiguro',
  'Sukuna Ryomen',
  'Monkey D. Luffy',
  'Roronoa Zoro',
  'Goro Majima',
  'Uraraka',
  'Izuku Midoriya',
  'Kim Dahyun',
  'Minatozaki Sana',
  'Park Jihyo',
  'Hirai Momo',
  'Kim Ji Woo (Chuu)',
  'Harry Styles',
  'Zayn Malik',
  'Liam Payne',
  'Niall Horan',
  'Louis Tomlinson',
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

  const marriagePartner = names[Math.floor(Math.random() * names.length)];

  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe;
  });

  const member = filtered[Math.floor(Math.random() * filtered.length)];

  const contactNumber = getNumberFromContactId(member.id);

  let imgUrl = await getImage(marriagePartner)
    .then((url) => url)
    .catch((results) => {
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
  command: '.marry',
  description:
    'Um casamento aleatorio entre um membro do grupo e um personagem de anime',
  func,
  onlyForGroups: true,
};

export default marry;
