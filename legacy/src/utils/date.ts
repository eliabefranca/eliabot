export function getCurrentTime(): string {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${h}:${m}:${s}`;
}

export function getCurrentDate(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${day}/${month}/${year}`;
}

export function getTimeStamp(): string {
  return `${getCurrentDate()} ${getCurrentTime()}`;
}
