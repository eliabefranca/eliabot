import { Chat, Client } from '@open-wa/wa-automate';

export async function getGroupByIdOrName(
  client: Client,
  idOrName: string
): Promise<Chat | null> {
  let targetGroup = null;

  const groups = await client.getAllGroups();
  console.log(groups);
  targetGroup =
    groups.filter(
      (group) => group.id === idOrName || group.name === idOrName
    )[0] ?? null;

  return targetGroup;
}
