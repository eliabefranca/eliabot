export function isUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch (e) {
    return false
  }
}
