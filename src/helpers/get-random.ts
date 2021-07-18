import {getRandomInterval} from "../bot/utils/get-random-interval";

export function getRandom<T>(array: T[]): T {
  const randomIndex = getRandomInterval(array.length - 1);
  return array[randomIndex];
}
