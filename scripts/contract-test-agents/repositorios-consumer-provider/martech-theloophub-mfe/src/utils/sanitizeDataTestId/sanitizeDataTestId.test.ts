import { sanitizeDataTestId } from './sanitizeDataTestId';

describe('sanitizeDataTestId', () => {
  it('should convert to lowercase', () => {
    expect(sanitizeDataTestId('UPPERCASE')).toBe('uppercase');
    expect(sanitizeDataTestId('MixedCase')).toBe('mixedcase');
  });

  it('should remove accents', () => {
    expect(sanitizeDataTestId('Açaí')).toBe('acai');
    expect(sanitizeDataTestId('Café')).toBe('cafe');
    expect(sanitizeDataTestId('São Paulo')).toBe('sao-paulo');
    expect(sanitizeDataTestId('Ñoño')).toBe('nono');
  });

  it('should replace special characters with hyphens', () => {
    expect(sanitizeDataTestId("25'dec")).toBe('25-dec');
    expect(sanitizeDataTestId('Volume (HL)')).toBe('volume-hl');
    expect(sanitizeDataTestId('Market Share %')).toBe('market-share');
    expect(sanitizeDataTestId('Net Revenue ($)')).toBe('net-revenue');
  });

  it('should replace spaces with hyphens', () => {
    expect(sanitizeDataTestId('Portfolio Performance')).toBe(
      'portfolio-performance',
    );
    expect(sanitizeDataTestId('Multiple   Spaces')).toBe('multiple-spaces');
  });

  it('should handle complex strings with multiple special chars and accents', () => {
    expect(sanitizeDataTestId("25'dec Volume (HL)")).toBe('25-dec-volume-hl');
    expect(sanitizeDataTestId('Portfolio Performance (Açaí & Café)')).toBe(
      'portfolio-performance-acai-cafe',
    );
  });

  it('should remove leading and trailing hyphens', () => {
    expect(sanitizeDataTestId('-test-')).toBe('test');
    expect(sanitizeDataTestId('---test---')).toBe('test');
    expect(sanitizeDataTestId(' test ')).toBe('test');
  });

  it('should replace multiple consecutive hyphens with single hyphen', () => {
    expect(sanitizeDataTestId('test--value')).toBe('test-value');
    expect(sanitizeDataTestId('test---value')).toBe('test-value');
  });

  it('should handle strings with only special characters', () => {
    expect(sanitizeDataTestId('!!!')).toBe('');
    expect(sanitizeDataTestId('---')).toBe('');
    expect(sanitizeDataTestId('   ')).toBe('');
  });

  it('should handle empty string', () => {
    expect(sanitizeDataTestId('')).toBe('');
  });

  it('should keep numbers and letters', () => {
    expect(sanitizeDataTestId('test123')).toBe('test123');
    expect(sanitizeDataTestId('2024-volume')).toBe('2024-volume');
  });

  it('should handle common header examples', () => {
    expect(sanitizeDataTestId('Portfolio')).toBe('portfolio');
    expect(sanitizeDataTestId('Brands')).toBe('brands');
    expect(sanitizeDataTestId('Volume (HL)')).toBe('volume-hl');
    expect(sanitizeDataTestId('Market Share (%)')).toBe('market-share');
    expect(sanitizeDataTestId('2024 vs 2023')).toBe('2024-vs-2023');
  });
});
