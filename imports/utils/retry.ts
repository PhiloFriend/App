type RetryOptions = {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
};

/**
 * Retries an asynchronous operation with exponential backoff.
 * 
 * @param operation - The async function to retry
 * @param options - Retry options
 * @returns A promise that resolves with the operation result or rejects if all retries fail
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${attempt + 1} failed:`, lastError);

      if (attempt === maxRetries - 1) {
        break;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Operation failed after ${maxRetries} attempts: ${lastError?.message}`);
}