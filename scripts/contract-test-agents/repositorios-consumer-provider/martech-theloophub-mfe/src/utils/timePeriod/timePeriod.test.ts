import {
  lastDataRefreshByTimePeriod,
  parseMonthYearString,
  vsLastYearByTimePeriod,
} from './timePeriod';

jest.mock('utils/date', () => ({
  getPreviusQuarter: jest.fn((date: Date) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 3);
    return newDate;
  }),
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: jest.fn((date: Date) => {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    const year = date.getFullYear().toString().slice(-2);
    return `Q${quarter}'${year}`;
  }),
  formatDateToR12M: jest.fn((date: Date, type?: string) => {
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    if (type === 'vsLastYear') {
      return `R12M ${month}'${year}`;
    }
    return `${month}'${year}`;
  }),
}));

describe('timePeriod', () => {
  describe('lastDataRefreshByTimePeriod', () => {
    it('should return empty string when dateInput is undefined', () => {
      expect(lastDataRefreshByTimePeriod(undefined, 'QTD')).toBe('');
    });

    it('should return empty string when timePeriod is undefined', () => {
      expect(lastDataRefreshByTimePeriod('2023-01-15', undefined)).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      expect(lastDataRefreshByTimePeriod('invalid-date', 'QTD')).toBe('');
    });

    it('should return empty string for unknown timePeriod', () => {
      expect(lastDataRefreshByTimePeriod('2023-01-15', 'UNKNOWN' as any)).toBe(
        '',
      );
    });

    it('should format QTD timePeriod correctly', () => {
      const result = lastDataRefreshByTimePeriod('2023-03-15', 'QTD');
      expect(result).toBe("Q1'23");
    });

    it('should format R12M timePeriod correctly', () => {
      const result = lastDataRefreshByTimePeriod('Jan - 2023', 'R12M');
      expect(result).toContain('23');
    });

    it('should handle Date object input', () => {
      const date = new Date('2023-06-15');
      const result = lastDataRefreshByTimePeriod(date, 'QTD');
      expect(result).toContain('23');
    });
  });

  describe('parseMonthYearString', () => {
    it('should parse month year string with dash separator', () => {
      const result = parseMonthYearString('Jan - 2023');
      expect(result.getFullYear()).toBe(2023);
    });

    it('should parse month year string without dash', () => {
      const result = parseMonthYearString('Jan 2023');
      expect(result.getFullYear()).toBe(2023);
    });

    it('should add one month to the result', () => {
      const result = parseMonthYearString('Jan - 2023');
      expect(result.getMonth()).toBe(1);
    });
  });

  describe('vsLastYearByTimePeriod', () => {
    it('should return empty string when dateInput is undefined', () => {
      expect(vsLastYearByTimePeriod(undefined, 'QTD')).toBe('');
    });

    it('should return empty string when timePeriod is undefined', () => {
      expect(vsLastYearByTimePeriod('2023-01-15', undefined)).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      expect(vsLastYearByTimePeriod('invalid-date', 'QTD')).toBe('');
    });

    it('should return empty string for unknown timePeriod', () => {
      expect(vsLastYearByTimePeriod('2023-01-15', 'UNKNOWN' as any)).toBe('');
    });

    it('should return previous quarter for QTD timePeriod', () => {
      const result = vsLastYearByTimePeriod('2023-06-15', 'QTD');
      expect(result).toContain('Q');
    });

    it('should return one year ago for R12M timePeriod', () => {
      const result = vsLastYearByTimePeriod('2023-06-15', 'R12M');
      expect(result).toContain('R12M');
      expect(result).toContain('22');
    });

    it('should handle Date object input', () => {
      const date = new Date('2023-06-15');
      const result = vsLastYearByTimePeriod(date, 'QTD');
      expect(result).toContain('Q');
    });
  });
});
