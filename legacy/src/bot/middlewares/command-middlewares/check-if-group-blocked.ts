import { blockedGroupsDb } from '@json-db';
import { CommandMiddleware } from '../../bot';

export const checkIfGroupBlocked: CommandMiddleware = async ({
  message,
}): Promise<boolean> => {
  const { chat } = message;

  if (!chat.isGroup) {
    return true;
  }

  const blockedGroup = blockedGroupsDb.getFirst({ groupId: chat.id });

  if (blockedGroup) {
    // await client.reply(message.from, 'Grupo bloqueado.', message.id);
    return false;
  }

  return true;
};
