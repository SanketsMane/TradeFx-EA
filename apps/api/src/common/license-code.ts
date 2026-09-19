import { randomInt } from 'node:crypto';

/**
 * Alphabet for licence codes: digits and uppercase letters minus the pairs
 * people mis-transcribe — no 0/O, no 1/I/L, and no U (so a random string
 * cannot spell certain words). 30 symbols over 9 characters is ~2e13
 * combinations, far beyond anything worth guessing at, and codes are checked
 * against the owning account anyway.
 */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
export const LICENSE_CODE_LENGTH = 9;

/** A fresh 9-character code. Uniqueness is enforced by the DB, not here. */
export function generateLicenseCode(): string {
  let out = '';
  // randomInt is rejection-sampled, so no modulo bias across the alphabet.
  for (let i = 0; i < LICENSE_CODE_LENGTH; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** Strips spaces and grouping dashes, then upper-cases. */
export function normalizeLicenseCode(input: string): string {
  return input.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidLicenseCode(input: string): boolean {
  const code = normalizeLicenseCode(input);
  return (
    code.length === LICENSE_CODE_LENGTH && [...code].every((c) => ALPHABET.includes(c))
  );
}
