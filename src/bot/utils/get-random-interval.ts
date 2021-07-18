export const getRandomInterval = function (max: number, min= 0) : number {// min and max included
  if (min > max) {
    const aux = min
    min = max
    max = aux
  }
  return Math.floor(Math.random() * (max - min + 1) + min)
}
