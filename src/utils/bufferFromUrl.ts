export async function bufferFromUrl(url: string): Promise<Buffer> {
  return fetch(url)
    .then((resp) => resp.arrayBuffer())
    .then((ab) => Buffer.from(ab));
}
