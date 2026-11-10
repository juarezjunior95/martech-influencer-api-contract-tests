import { getFullMonthName } from './tooltipTextFormat';

describe('tooltipTextFormat', () => {
  describe('getFullMonthName', () => {
    it('should return full month name for JAN', () => {
      expect(getFullMonthName('JAN', 2023)).toBe('January 2023');
    });

    it('should return full month name for FEB', () => {
      expect(getFullMonthName('FEB', 2023)).toBe('February 2023');
    });

    it('should return full month name for MAR', () => {
      expect(getFullMonthName('MAR', 2023)).toBe('March 2023');
    });

    it('should return full month name for APR', () => {
      expect(getFullMonthName('APR', 2023)).toBe('April 2023');
    });

    it('should return full month name for MAY', () => {
      expect(getFullMonthName('MAY', 2023)).toBe('May 2023');
    });

    it('should return full month name for JUN', () => {
      expect(getFullMonthName('JUN', 2023)).toBe('June 2023');
    });

    it('should return full month name for JUL', () => {
      expect(getFullMonthName('JUL', 2023)).toBe('July 2023');
    });

    it('should return full month name for AUG', () => {
      expect(getFullMonthName('AUG', 2023)).toBe('August 2023');
    });

    it('should return full month name for SEP', () => {
      expect(getFullMonthName('SEP', 2023)).toBe('September 2023');
    });

    it('should return full month name for OCT', () => {
      expect(getFullMonthName('OCT', 2023)).toBe('October 2023');
    });

    it('should return full month name for NOV', () => {
      expect(getFullMonthName('NOV', 2023)).toBe('November 2023');
    });

    it('should return full month name for DEC', () => {
      expect(getFullMonthName('DEC', 2023)).toBe('December 2023');
    });

    it('should handle lowercase abbreviations', () => {
      expect(getFullMonthName('jan', 2024)).toBe('January 2024');
      expect(getFullMonthName('dec', 2024)).toBe('December 2024');
    });

    it('should handle mixed case abbreviations', () => {
      expect(getFullMonthName('Jan', 2024)).toBe('January 2024');
      expect(getFullMonthName('DeC', 2024)).toBe('December 2024');
    });

    it('should return undefined for invalid abbreviations', () => {
      expect(getFullMonthName('INVALID', 2023)).toBeUndefined();
      expect(getFullMonthName('XYZ', 2023)).toBeUndefined();
      expect(getFullMonthName('', 2023)).toBeUndefined();
    });
  });
});
