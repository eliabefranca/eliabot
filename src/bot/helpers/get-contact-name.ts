import { Contact } from '@open-wa/wa-automate';

export function getContactName(contact: Contact): string {
  return (
    contact.pushname ||
    contact.verifiedName ||
    contact.formattedName ||
    '<sem nome/>'
  );
}
