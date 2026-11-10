import {
  formatDateToMonthYear,
  formatDateToQuarterYear,
  formatDateToR12M,
  formatNumber,
  formatNumberWithSuffix,
  normalizeString,
  parseFiniteNumber,
  parseNumber,
  parsePercentage,
} from './format';

describe('format', () => {
  describe('parseNumber', () => {
    it('should parse simple number string', () => {
      expect(parseNumber('123')).toBe(123);
    });

    it('should parse number with comma', () => {
      expect(parseNumber('1,234')).toBe(1234);
    });

    it('should parse number with multiple commas', () => {
      expect(parseNumber('1,234,567')).toBe(1234567);
    });

    it('should parse number with decimal', () => {
      expect(parseNumber('123.45')).toBe(123.45);
    });
  });

  describe('parsePercentage', () => {
    test('should parse numeric string without percent sign', () => {
      expect(parsePercentage('51.2')).toBe(51.2);
    });

    test('should parse string with percent sign', () => {
      expect(parsePercentage('51.2%')).toBe(51.2);
    });

    test('should trim whitespace', () => {
      expect(parsePercentage('  12.5%  ')).toBe(12.5);
    });

    test('should return NaN for empty string', () => {
      expect(parsePercentage('')).toBeNaN();
    });

    test('should return NaN for invalid value', () => {
      expect(parsePercentage('abc')).toBeNaN();
    });
  });

  describe('parseFiniteNumber', () => {
    it('returns finite numbers as-is', () => {
      expect(parseFiniteNumber(42)).toBe(42);
      expect(parseFiniteNumber(-0.5)).toBe(-0.5);
    });

    it('returns null for non-finite numbers', () => {
      expect(parseFiniteNumber(Number.NaN)).toBeNull();
      expect(parseFiniteNumber(Number.POSITIVE_INFINITY)).toBeNull();
    });

    it('parses numeric strings', () => {
      expect(parseFiniteNumber('100')).toBe(100);
      expect(parseFiniteNumber('  3.14  ')).toBe(3.14);
    });

    it('returns null for empty or invalid strings', () => {
      expect(parseFiniteNumber('')).toBeNull();
      expect(parseFiniteNumber('   ')).toBeNull();
      expect(parseFiniteNumber('abc')).toBeNull();
    });

    it('returns null for nullish and non-numeric types', () => {
      expect(parseFiniteNumber(null)).toBeNull();
      expect(parseFiniteNumber(undefined)).toBeNull();
      expect(parseFiniteNumber({})).toBeNull();
    });
  });

  describe('formatNumber', () => {
    it('should format number with default decimals', () => {
      expect(formatNumber(1234.5)).toBe('1,234.5');
    });

    it('should format number with custom minimum decimals', () => {
      expect(formatNumber(1234, 2, 2)).toBe('1,234.00');
    });

    it('should format number with custom maximum decimals', () => {
      expect(formatNumber(1234.567, 1, 2)).toBe('1,234.57');
    });

    it('should format zero', () => {
      expect(formatNumber(0)).toBe('0.0');
    });

    it('should format negative numbers', () => {
      expect(formatNumber(-1234.5)).toBe('-1,234.5');
    });

    it('returns empty string for NaN', () => {
      expect(formatNumber(Number.NaN)).toBe('');
    });

    it('returns empty string for Infinity', () => {
      expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('');
      expect(formatNumber(Number.NEGATIVE_INFINITY)).toBe('');
    });
  });

  describe('formatNumberWithSuffix', () => {
    it('should format thousands with k suffix', () => {
      const result = formatNumberWithSuffix(1500);
      expect(result.value).toBe('1.5k');
      expect(result.wasFormatted).toBe(true);
    });

    it('should format millions with M suffix', () => {
      const result = formatNumberWithSuffix(1500000);
      expect(result.value).toBe('1.5M');
      expect(result.wasFormatted).toBe(true);
    });

    it('should format billions with B suffix', () => {
      const result = formatNumberWithSuffix(1500000000);
      expect(result.value).toBe('1.5B');
      expect(result.wasFormatted).toBe(true);
    });

    it('should format trillions with T suffix', () => {
      const result = formatNumberWithSuffix(1500000000000);
      expect(result.value).toBe('1.5T');
      expect(result.wasFormatted).toBe(true);
    });

    it('should not format numbers below 1000', () => {
      const result = formatNumberWithSuffix(999);
      expect(result.wasFormatted).toBe(false);
    });

    it('should handle string input', () => {
      const result = formatNumberWithSuffix('1,500,000');
      expect(result.value).toBe('1.5M');
      expect(result.wasFormatted).toBe(true);
    });

    it('should handle negative numbers', () => {
      const result = formatNumberWithSuffix(-1500000);
      expect(result.value).toBe('-1.5M');
      expect(result.wasFormatted).toBe(true);
    });

    it('should return original value for NaN', () => {
      const result = formatNumberWithSuffix('not a number');
      expect(result.value).toBe('not a number');
      expect(result.wasFormatted).toBe(false);
    });

    it('should remove trailing .0', () => {
      const result = formatNumberWithSuffix(1000);
      expect(result.value).toBe('1k');
    });
  });

  describe('normalizeString', () => {
    it('should convert to camelCase', () => {
      expect(normalizeString('hello world', 'camel')).toBe('helloWorld');
    });

    it('should convert to PascalCase', () => {
      expect(normalizeString('hello world', 'Pascal')).toBe('HelloWorld');
    });

    it('should convert to kebab-case', () => {
      expect(normalizeString('hello world', 'kebab')).toBe('hello-world');
    });

    it('should convert to snake_case by default', () => {
      expect(normalizeString('hello world')).toBe('hello_world');
    });

    it('should convert to snake_case explicitly', () => {
      expect(normalizeString('hello world', 'snake')).toBe('hello_world');
    });
  });

  describe('formatDateToQuarterYear', () => {
    it('should return empty string when date is undefined', () => {
      expect(formatDateToQuarterYear(undefined)).toBe('');
    });

    it('should format Q1 for March', () => {
      const date = new Date(2023, 2, 15);
      expect(formatDateToQuarterYear(date)).toBe('Q1´23');
    });

    it('should format Q2 for April-June', () => {
      const date = new Date(2023, 4, 15);
      expect(formatDateToQuarterYear(date)).toBe('Q2´23');
    });

    it('should format Q3 for July-September', () => {
      const date = new Date(2023, 7, 15);
      expect(formatDateToQuarterYear(date)).toBe('Q3´23');
    });

    it('should format Q4 for October-December', () => {
      const date = new Date(2023, 10, 15);
      expect(formatDateToQuarterYear(date)).toBe('Q4´23');
    });

    it('should format Q4 of previous year for January-February', () => {
      const date = new Date(2023, 0, 15);
      expect(formatDateToQuarterYear(date)).toBe('Q4´22');
    });

    it('should use custom divider', () => {
      const date = new Date(2023, 5, 15);
      expect(formatDateToQuarterYear(date, '´')).toBe('Q2´23');
    });

    it('should use custom year slice', () => {
      const date = new Date(2023, 5, 15);
      expect(formatDateToQuarterYear(date, '´', 0)).toBe('Q2´2023');
    });
  });
  describe('formatDateToMonthYear', () => {
    it('should return empty string when date is undefined', () => {
      expect(formatDateToMonthYear(undefined)).toBe('');
    });

    it('should format date to month and year', () => {
      const date = new Date(2023, 5, 15);
      const result = formatDateToMonthYear(date);
      expect(result).toContain('Jun');
      expect(result).toContain('23');
    });

    it('should handle January', () => {
      const date = new Date(2023, 0, 1);
      const result = formatDateToMonthYear(date);
      expect(result).toContain('Jan');
      expect(result).toContain('23');
    });

    it('should handle December', () => {
      const date = new Date(2023, 11, 31);
      const result = formatDateToMonthYear(date);
      expect(result).toContain('Dec');
      expect(result).toContain('23');
    });
  });

  describe('formatDateToR12M', () => {
    it('should return empty string when date is undefined', () => {
      expect(formatDateToR12M(undefined)).toBe('');
    });

    it('should format rolling 12 months range', () => {
      const date = new Date(2023, 11, 15);
      const result = formatDateToR12M(date);
      expect(result).toContain('-');
      expect(result.length).toBeGreaterThan(10);
    });

    it('should handle vsLastYear type', () => {
      const date = new Date(2023, 11, 15);
      const result = formatDateToR12M(date, 'vsLastYear');
      expect(result).toContain('-');
    });

    it('should format 12 month range correctly', () => {
      const date = new Date(2023, 5, 15);
      const result = formatDateToR12M(date);
      expect(result).toContain('-');
      expect(result).toContain('22');
      expect(result).toContain('23');
    });
  });
});
