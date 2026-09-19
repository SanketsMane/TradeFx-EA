/**
 * Phone handling for OTP sign-in.
 *
 * Our SMS gateway is India-only and wants a bare 10-digit national number, so
 * that is what we normalise to and store. Accepts the shapes people actually
 * type — +91 98765 43210, 0091-9876543210, 09876543210 — and rejects anything
 * that is not a valid Indian mobile number rather than passing it to the
 * gateway and burning a credit on a failure.
 */
const NATIONAL_LENGTH = 10;

/** Indian mobile numbers start 6–9; landlines and short codes do not. */
const MOBILE_RE = /^[6-9]\d{9}$/;

/**
 * Returns the 10-digit national number, or null if the input is not one.
 */
export function normalizePhone(input: string): string | null {
  let digits = (input ?? '').replace(/\D/g, '');

  // Strip the country code in its various written forms.
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 13 && digits.startsWith('091')) digits = digits.slice(3);
  else if (digits.length === 14 && digits.startsWith('0091')) digits = digits.slice(4);
  // A leading trunk 0 on a national number.
  else if (digits.length === NATIONAL_LENGTH + 1 && digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== NATIONAL_LENGTH) return null;
  return MOBILE_RE.test(digits) ? digits : null;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** For display: 98765 43210. */
export function formatPhone(national: string): string {
  return national.length === NATIONAL_LENGTH
    ? `${national.slice(0, 5)} ${national.slice(5)}`
    : national;
}
