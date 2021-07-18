import {Command, CommandData} from "../protocols/command";
import validPerson from "./utils/validPerson";
import getRandomInterval from "./utils/getRandomInterval";

const func: Command = async ({client, message, value}) => {
  const personToCalculateSize = await validPerson(client, message, value, 'Você precisa me informar o nome de quem quer saber o tamanho do piupiu')
  const sizePiupiu = getRandomInterval(2, 20)
  const piupiu = '8' + '='.repeat(sizePiupiu) + 'D'
  if (personToCalculateSize != null) {
    const msg = `O ${personToCalculateSize} me contou que o tamanho do piupiu dele é de ${sizePiupiu}cm\n${piupiu}`
    await client.sendTextWithMentions(message.from, msg)
  }
}

const size: CommandData = {
  command: '.size',
  description: 'Descubra o tamanho do piupiu de alguém',
  func,
  onlyForGroups: true,
  // hidden: true,
};

export default size