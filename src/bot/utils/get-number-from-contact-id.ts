export function getNumberFromContactId(id: string): string {
  return id.split('@')[0];
}
