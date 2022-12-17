import makeWASocket, {
  fetchLatestBaileysVersion,
  MessageRetryMap,
  useMultiFileAuthState,
} from '@adiwajshing/baileys';
import mainLogger from '@adiwajshing/baileys/lib/Utils/logger';

export const logger = mainLogger.child({});
logger.level = 'trace';

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterMap: MessageRetryMap = {};
export async function makeSock() {
  const { state } = await useMultiFileAuthState('baileys_auth_info');
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
