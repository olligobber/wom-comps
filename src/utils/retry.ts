import { debugLog } from "../utils/debug_log";

export async function retryAsync<T>(name: string, fn: () => Promise<T>, maxAttempts : number = 5): Promise<T> {
  const baseDelayMs = 100;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      debugLog(
        "Attempt",
        attempt,
        "of",
        maxAttempts,
        "while running \"" + name + "\" produced error:",
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      )
      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = baseDelayMs * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never happen, but TypeScript needs a return
  throw new Error("retryAsync failed unexpectedly");
}
