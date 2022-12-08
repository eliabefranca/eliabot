import {Message} from "@open-wa/wa-automate";
import {Participant} from "@open-wa/wa-automate/dist/api/model/group-metadata";

function participantIsPerson(participant: Participant, person: string) : boolean {
  return (participant.id as any).includes(person);
}

export const getPersonExists = function(message: Message, person: string) {
  return message.chat.groupMetadata.participants.some(
    (participant) => participantIsPerson(participant, person)
  );
}
