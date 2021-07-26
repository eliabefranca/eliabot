import { usersDb } from '@json-db';
import { getNumberFromContactId } from '../utils/get-number-from-contact-id';
import { MessageEventHandler } from '../protocols/message-event-handler';
import { getContactName } from './get-contact-name';

export const updateUser: MessageEventHandler = ({ message }) => {
  const { id } = message.sender;

  usersDb.updateOrInsert(
    { id },
    {
      id,
      name: getContactName(message.sender),
      number: getNumberFromContactId(message.sender.id),
      profilePic: message.sender.profilePicThumbObj.eurl,
    }
  );
};
