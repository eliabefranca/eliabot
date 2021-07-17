import { groupsDb } from '../../database/json/db';
import { MessageEventHandler } from '../protocols/message-event-handler';

export const updateGroup: MessageEventHandler = ({ message }) => {
  const { id, name, contact } = message.chat;

  groupsDb.updateOrInsert(
    { id },
    {
      id,
      name: name,
      thumb: contact.profilePicThumbObj.eurl,
    }
  );
};
