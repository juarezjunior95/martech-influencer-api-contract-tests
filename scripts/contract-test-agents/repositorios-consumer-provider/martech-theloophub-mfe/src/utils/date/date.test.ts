import {
  getJanuaryFirstYmdFromDtEnd,
  getPreviusQuarter,
  parseDate,
} from './date';

describe('date', () => {
  describe('parseDate', () => {
    it('should parse date in DD-MM-YYYY format', () => {
      const result = parseDate('15-06-2023');

      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(5);
      expect(result?.getFullYear()).toBe(2023);
    });

    it('should parse first day of year', () => {
      const result = parseDate('01-01-2023');

      expect(result?.getDate()).toBe(1);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getFullYear()).toBe(2023);
    });

    it('should parse last day of year', () => {
      const result = parseDate('31-12-2023');

      expect(result?.getDate()).toBe(31);
      expect(result?.getMonth()).toBe(11);
      expect(result?.getFullYear()).toBe(2023);
    });

    it('should parse Q1 quarter format', () => {
      const result = parseDate('Q1-2023');

      expect(result).toBeInstanceOf(Date);
      expect(result?.getUTCMonth()).toBe(3);
      expect(result?.getUTCFullYear()).toBe(2023);
    });

    it('should parse Q2 quarter format', () => {
      const result = parseDate('Q2-2023');

      expect(result?.getUTCMonth()).toBe(6);
      expect(result?.getUTCFullYear()).toBe(2023);
    });

    it('should parse Q3 quarter format', () => {
      const result = parseDate('Q3-2023');

      expect(result?.getUTCMonth()).toBe(9);
      expect(result?.getUTCFullYear()).toBe(2023);
    });

    it('should parse Q4 quarter format', () => {
      const result = parseDate('Q4-2023');

      expect(result?.getUTCMonth()).toBe(0);
      expect(result?.getUTCFullYear()).toBe(2024);
    });

    it('should return null for invalid date format', () => {
      expect(parseDate('2023-06-15')).toBeNull();
      expect(parseDate('15/06/2023')).toBeNull();
      expect(parseDate('invalid')).toBeNull();
      expect(parseDate('')).toBeNull();
    });

    it('should return null for invalid quarter format', () => {
      expect(parseDate('Q5-2023')).toBeNull();
      expect(parseDate('Q0-2023')).toBeNull();
      expect(parseDate('Q12023')).toBeNull();
    });
  });

  describe('getJanuaryFirstYmdFromDtEnd', () => {
    it('returns January 1st for YYYY-MM-DD dt_end', () => {
      expect(getJanuaryFirstYmdFromDtEnd('2024-06-15')).toBe('2024-01-01');
    });

    it('returns January 1st for DD-MM-YYYY dt_end', () => {
      expect(getJanuaryFirstYmdFromDtEnd('15-06-2024')).toBe('2024-01-01');
    });

    it('returns empty string for empty or unparseable input', () => {
      expect(getJanuaryFirstYmdFromDtEnd('')).toBe('');
      expect(getJanuaryFirstYmdFromDtEnd(undefined)).toBe('');
      expect(getJanuaryFirstYmdFromDtEnd('invalid')).toBe('');
    });
  });

  describe('getPreviusQuarter', () => {
    it('should return date one year before', () => {
      const date = new Date(2023, 5, 15);
      const result = getPreviusQuarter(date);

      expect(result?.getFullYear()).toBe(2022);
      expect(result?.getMonth()).toBe(5);
    });

    it('should return null for null input', () => {
      expect(getPreviusQuarter(null as any)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(getPreviusQuarter(undefined as any)).toBeNull();
    });

    it('should set day to first of month', () => {
      const date = new Date(2023, 5, 20);
      const result = getPreviusQuarter(date);

      expect(result?.getDate()).toBe(1);
    });

    it('should handle January correctly', () => {
      const date = new Date(2023, 0, 15);
      const result = getPreviusQuarter(date);

      expect(result?.getFullYear()).toBe(2022);
      expect(result?.getMonth()).toBe(0);
    });

    it('should handle December correctly', () => {
      const date = new Date(2023, 11, 31);
      const result = getPreviusQuarter(date);

      expect(result?.getFullYear()).toBe(2022);
      expect(result?.getMonth()).toBe(11);
    });
  });
});
