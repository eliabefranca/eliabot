import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  MessageRetryMap,
  useMultiFileAuthState,
} from '@adiwajshing/baileys';
import mainLogger from '@adiwajshing/baileys/lib/Utils/logger';
import { Boom } from '@hapi/boom';

export const logger = mainLogger.child({});
logger.level = 'trace';

const doReplies = !process.argv.includes('--no-reply');

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterMap: MessageRetryMap = {};

export async function makeSock() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
  // fetch latest version of WA Web
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

  return makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      /** caching makes the store faster to send/recv messages */
      keys: state.keys,
    },
    msgRetryCounterMap,
    logger,
  });
}

// const startSock = async () => {
//   const sock = await makeSock();

//   const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
//     await sock.presenceSubscribe(jid);
//     await delay(500);

//     await sock.sendPresenceUpdate('composing', jid);
//     await delay(2000);

//     await sock.sendPresenceUpdate('paused', jid);

//     await sock.sendMessage(jid, msg);
//   };

//   // the process function lets you process all events that just occurred
//   // efficiently in a batch
//   sock.ev.process(
//     // events is a map for event name => event data
//     async (events) => {
//       // something about the connection changed
//       // maybe it closed, or we received all offline message or connection opened
//       if (events['connection.update']) {
//         const update = events['connection.update'];
//         const { connection, lastDisconnect } = update;
//         if (connection === 'close') {
//           // reconnect if not logged out
//           if (
//             (lastDisconnect?.error as Boom)?.output?.statusCode !==
//             DisconnectReason.loggedOut
//           ) {
//             startSock();
//           } else {
//             console.log('Connection closed. You are logged out.');
//           }
//         }

//         console.log('connection update', update);
//       }

//       // credentials updated -- save them
//       if (events['creds.update']) {
//         await saveCreds();
//       }

//       if (events.call) {
//         // console.log('recv call event', events.call);
//       }

//       // received a new message
//       if (events['messages.upsert']) {
//         const upsert = events['messages.upsert'];
//         // console.log('recv messages ', JSON.stringify(upsert, undefined, 2));

//         if (upsert.type === 'notify') {
//           for (const messageInfo of upsert.messages) {
//             if (!messageInfo.key.fromMe && doReplies) {
//               await sock!.readMessages([messageInfo.key]);

//               await handleCommand({
//                 messageInfo,
//                 client: sock!,
//               });
//             }
//           }
//         }
//       }

//       // messages updated like status delivered, message deleted etc.
//       if (events['messages.update']) {
//         // console.log(events['messages.update']);
//       }

//       if (events['message-receipt.update']) {
//         // console.log(events['message-receipt.update']);
//       }

//       if (events['messages.reaction']) {
//         // console.log(events['messages.reaction']);
//       }

//       if (events['presence.update']) {
//         // console.log(events['presence.update']);
//       }

//       if (events['chats.update']) {
//         // console.log(events['chats.update']);
//       }

//       if (events['contacts.update']) {
//         for (const contact of events['contacts.update']) {
//           if (typeof contact.imgUrl !== 'undefined') {
//             const newUrl =
//               contact.imgUrl === null
//                 ? null
//                 : await sock!.profilePictureUrl(contact.id!).catch(() => null);
//             console.log(
//               `contact ${contact.id} has a new profile pic: ${newUrl}`
//             );
//           }
//         }
//       }

//       if (events['chats.delete']) {
//         console.log('chats deleted ', events['chats.delete']);
//       }
//     }
//   );

//   return sock;
// };

// startSock();
