import {Client, Message} from "@open-wa/wa-automate";

export const outputErrorMessage = async (client: Client, message: Message, text: string) => {
  await client.reply(
    message.from,
    text,
    message.id
  );
}
