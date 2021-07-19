import {outputErrorMessage} from "./output-error-message";
import {getPersonExists} from "./get-person-exists";
import {Client, Message} from "@open-wa/wa-automate";

const ESPECIAL_CHAR = '@'

export const validPerson = async function (client: Client, message: Message, value: string | undefined, errorText: string) {
  if (value?.charAt(0) !== ESPECIAL_CHAR) {
    await outputErrorMessage(client, message, errorText)
    return null
  }
  const person = value.trim();
  if (person === ESPECIAL_CHAR) {
    await outputErrorMessage(client, message, `Não tem como uma pessoa se chamar ${ESPECIAL_CHAR}.`)
    return null
  }
  const personExists = getPersonExists(message, person.slice(1))
  if (!personExists) {
    await outputErrorMessage(client, message, 'A pessoa informada não existe no grupo.')
    return null
  }
  return person
}
