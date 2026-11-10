import { truncateText } from './truncateText';

describe('truncateText', () => {
  describe('with default maxLength (20)', () => {
    it.each([
      ['Short text', 'Short text'],
      ['12345678901234567890', '12345678901234567890'],
      ['123456789012345678901', '12345678901234567890...'],
    ])('truncateText(%s) with default cap', (text, expected) => {
      expect(truncateText(text)).toBe(expected);
    });

    it('truncates long prose and preserves ellipsis length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23);
    });
  });

  describe('with custom maxLength', () => {
    it.each([
      ['Hello World', 5, 'Hello...'],
      ['Hi', 10, 'Hi'],
      ['Hello', 1, 'H...'],
      ['Short', 100, 'Short'],
    ])('truncateText(%s, %i)', (text, maxLength, expected) => {
      expect(truncateText(text, maxLength)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(truncateText('')).toBe('');
    });

    it('handles single character', () => {
      expect(truncateText('A')).toBe('A');
    });

    it('handles string with spaces under a short cap', () => {
      expect(truncateText('   ', 2)).toBe('  ...');
    });

    it('handles special characters under a short cap', () => {
      expect(truncateText('!@#$%^&*()_+', 5)).toBe('!@#$%...');
    });

    it('handles unicode letters under a short cap', () => {
      expect(truncateText('Brasileiro', 5)).toBe('Brasi...');
    });
  });
});
