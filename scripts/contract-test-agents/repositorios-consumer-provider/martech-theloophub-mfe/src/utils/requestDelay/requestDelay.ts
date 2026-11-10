export function requestDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
