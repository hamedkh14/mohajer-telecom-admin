export function applyPercentage(price: number, percentage: number, increase: boolean = true) {
  return Math.floor(increase ? price * (1 + percentage / 100) : price * (1 - percentage / 100));
}
