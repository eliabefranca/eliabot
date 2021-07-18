import {Message} from "@open-wa/wa-automate";

const getPersonExists = function(message: Message, person: string) {
  return message.chat.groupMetadata.participants.some(
    async (participant) => (participant.id as any).includes(person)
  );
}

export default getPersonExists