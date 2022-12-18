export function isUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}
