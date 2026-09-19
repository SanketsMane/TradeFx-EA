import { formatPhone, isValidPhone, normalizePhone } from './phone';

describe('phone normalisation', () => {
  it.each([
    ['plain national', '9876543210'],
    ['with +91', '+919876543210'],
    ['with spaces', '+91 98765 43210'],
    ['with dashes', '091-9876543210'],
    ['with 0091', '00919876543210'],
    ['with trunk zero', '09876543210'],
    ['with brackets', '(+91) 98765-43210'],
  ])('accepts a number written %s', (_label, input) => {
    expect(normalizePhone(input)).toBe('9876543210');
  });

  it.each([
    ['too short', '98765432'],
    ['too long', '98765432109876'],
    ['starts below 6', '5876543210'],
    ['all zeroes', '0000000000'],
    ['letters', 'notaphone'],
    ['empty', ''],
  ])('rejects a number that is %s', (_label, input) => {
    expect(normalizePhone(input)).toBeNull();
    expect(isValidPhone(input)).toBe(false);
  });

  it('formats for display', () => {
    expect(formatPhone('9876543210')).toBe('98765 43210');
  });
});
