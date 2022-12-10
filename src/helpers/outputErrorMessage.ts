import makeWASocket, { proto } from '@adiwajshing/baileys';

export const outputErrorMessage = async (
  client: ReturnType<typeof makeWASocket>,
  message: proto.IWebMessageInfo,
  text: string
) => {
  await client.sendMessage(
    message.key.remoteJid!,
    { text },
    { quoted: message }
  );
};
