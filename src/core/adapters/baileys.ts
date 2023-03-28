import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  MessageRetryMap,
  useMultiFileAuthState,
} from '@adiwajshing/baileys';
import mainLogger from '@adiwajshing/baileys/lib/Utils/logger';
import { Boom } from '@hapi/boom';

export const logger = mainLogger.child({});
logger.level = 'silent';

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterMap: MessageRetryMap = {};
export async function makeSock() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
  // fetch latest version of WA Web
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
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

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      // reconnect if not logged out
      if (
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut
      ) {
        makeSock();
      } else {
        console.log('Connection closed. You are logged out.');
      }
    }

    console.log('connection update', update);
  });

  return sock;
}
