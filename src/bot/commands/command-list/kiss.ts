import { getNumberFromContactId } from '../../utils/get-number-from-contact-id';
import { Command, CommandData, CommandType } from '@command-protocols';
import { validPerson } from '../../utils/valid-person';
import { getRandom } from '../../../helpers/get-random';

const func: Command = async ({ client, message, value }) => {
  const kissedPerson = await validPerson(
    client,
    message,
    value,
    'Você precisa me dizer qual pessoa você quer beijar'
  );
  if (kissedPerson) {
    const giphys = [
      'https://media.giphy.com/media/f5vXCvhSJsZxu/giphy.gif',
      'https://media.giphy.com/media/108M7gCS1JSoO4/giphy.gif',
      'https://media.giphy.com/media/108M7gCS1JSoO4/giphy.gif',
      'https://media.giphy.com/media/CGXNYwxCB0x2M/giphy.gif',
      'https://media.giphy.com/media/1n8xEcgopDKzDcQgL1/giphy.gif',
      'https://media.giphy.com/media/nlYANXaU495cc/giphy.gif',
    ];
    await client.sendGiphyAsSticker(message.from, getRandom(giphys));
    const msg = `Minha nossa!!\n @${getNumberFromContactId(
      message.sender.id
    )} deu um beijo em ${kissedPerson}`;

    await client.sendTextWithMentions(message.from, msg);
  }
};

const kiss: CommandData = {
  command: '.kiss',
  category: CommandType.FUNNY,
  description: 'Mande um beijo para alguém do grupo',
  func,
  onlyForGroups: true,
  // hidden: true,
};

export default kiss;
