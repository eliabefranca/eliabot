import {getNumberFromContactId} from '../../../helpers/get-number-from-contact-id';
import {Command, CommandData} from '../protocols/command';
import {getRamdom} from '../../../helpers/get-random';
import getPersonExists from "./utils/getPersonExists";
import outputErrorMessage from "./utils/outputErrorMessage";
import validPerson from "./utils/validPerson";

const mime = require('mime-types');
const giphys = [
  'https://media.giphy.com/media/f5vXCvhSJsZxu/giphy.gif',
  'https://media.giphy.com/media/108M7gCS1JSoO4/giphy.gif',
  'https://media.giphy.com/media/108M7gCS1JSoO4/giphy.gif',
  'https://media.giphy.com/media/CGXNYwxCB0x2M/giphy.gif',
  'https://media.giphy.com/media/1n8xEcgopDKzDcQgL1/giphy.gif',
  'https://media.giphy.com/media/nlYANXaU495cc/giphy.gif',
]

const func: Command = async ({ client, message, value }) => {
  const kissedPerson = validPerson(client, message, value, 'Você precisa me dizer qual pessoa você quer beijar')
  if (kissedPerson != null) {
    await client.sendGiphyAsSticker(message.from, getRamdom(giphys));

    const msg = `Minha nossa!!\n @${getNumberFromContactId(
      message.sender.id
    )} deu um beijo em ${kissedPerson}`;

    await client.sendTextWithMentions(message.from, msg);  
  }

  // const videoPath = path.join(__dirname, 'mp4', 'kiss.mp4');
  // const file = fs.readFileSync(videoPath);
  // const mimeType = mime.lookup(videoPath);
  // const base64 = `data:${mimeType};base64,${file.toString('base64')}`;
  // await client.sendImage(message.from, base64, 'kiss.mp4', '', message.id);
  
};

const kiss: CommandData = {
  command: '.kiss',
  description: 'Mande um beijo para alguém do grupo',
  func,
  onlyForGroups: true,
  // hidden: true,
};

export default kiss;
