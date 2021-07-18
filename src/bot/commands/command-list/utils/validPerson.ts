import outputErrorMessage from "./outputErrorMessage";
import getPersonExists from "./getPersonExists";
import {Client, Message} from "@open-wa/wa-automate";

const validPerson = async function (client: Client, message: Message, value: string | undefined, errorText: string) {
  if (value?.charAt(0) !== '@') {
    await outputErrorMessage(client, message, errorText);
    return null;
  }
  const person = value.trim();
  const personExists = await getPersonExists(message, person);
  if (!personExists) {
    await outputErrorMessage(client, message, 'A pessoa informada não existe no grupo');
    return null;
  }
  return person;
}


export default validPerson