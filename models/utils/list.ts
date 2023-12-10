/**
 * Split an array into chunks of a given size.
 * @param arr
 * @param chunkSize
 */
export function splitIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}
