import {getErrorMessage} from './getErrorMessage.ts';

export async function fetchWithRetry(
  url: string,
  attempts = 50,
  delay = 300,
  setError?: (msg: string) => void
) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      if (setError) setError(getErrorMessage(error));
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error('Backend unavailable');
}
