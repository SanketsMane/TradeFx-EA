import {
  LICENSE_CODE_LENGTH,
  generateLicenseCode,
  isValidLicenseCode,
  normalizeLicenseCode,
} from './license-code';

describe('licence codes', () => {
  it('generates 9-character codes from the unambiguous alphabet', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateLicenseCode();
      expect(code).toHaveLength(LICENSE_CODE_LENGTH);
      // No characters people mistype for one another.
      expect(code).not.toMatch(/[ILOU01]/);
      expect(code).toMatch(/^[A-Z2-9]{9}$/);
    }
  });

  it('does not repeat itself over a large sample', () => {
    const seen = new Set(Array.from({ length: 2000 }, () => generateLicenseCode()));
    expect(seen.size).toBe(2000);
  });

  it('normalises the grouped form the UI displays', () => {
    expect(normalizeLicenseCode('k7m-4xq-2r9')).toBe('K7M4XQ2R9');
    expect(normalizeLicenseCode(' K7M 4XQ 2R9 ')).toBe('K7M4XQ2R9');
  });

  it('accepts a valid code in either form', () => {
    expect(isValidLicenseCode('K7M4XQ2R9')).toBe(true);
    expect(isValidLicenseCode('k7m-4xq-2r9')).toBe(true);
  });

  it.each([
    ['too short', 'K7M4XQ2R'],
    ['too long', 'K7M4XQ2R99'],
    ['contains an excluded letter', 'K7M4XQ2RO'],
    ['contains a symbol', 'K7M4XQ2R!'],
    ['empty', ''],
  ])('rejects a code that is %s', (_label, code) => {
    expect(isValidLicenseCode(code)).toBe(false);
  });
});
