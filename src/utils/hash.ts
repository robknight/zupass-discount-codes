import { createHash } from 'crypto';

/**
 * Hashes the input string using SHA-256 and returns a hex string.
 * @param input - The string to hash (e.g., ticketId)
 */
export function hashTicketId(input: string): string {
  return createHash('sha256').update(input).digest('hex');
} 