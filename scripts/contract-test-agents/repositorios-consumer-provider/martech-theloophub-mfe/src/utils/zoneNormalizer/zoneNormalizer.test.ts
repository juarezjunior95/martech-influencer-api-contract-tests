import { normalizeZone } from './zoneNormalizer';

describe('zoneNormalizer', () => {
  describe('normalizeZone', () => {
    it('should normalize EUR to Europe', () => {
      expect(normalizeZone('EUR')).toBe('Europe');
    });

    it('should normalize AFR to Africa', () => {
      expect(normalizeZone('AFR')).toBe('Africa');
    });

    it('should normalize APAC to Asia Pacific', () => {
      expect(normalizeZone('APAC')).toBe('Asia Pacific');
    });

    it('should normalize MAZ to Middle East and Africa', () => {
      expect(normalizeZone('MAZ')).toBe('Middle East and Africa');
    });

    it('should normalize NAZ to North America', () => {
      expect(normalizeZone('NAZ')).toBe('North America');
    });

    it('should normalize SAZ to South America', () => {
      expect(normalizeZone('SAZ')).toBe('South America');
    });

    it('should return original zone when not found in normalizer', () => {
      expect(normalizeZone('UNKNOWN')).toBe('UNKNOWN');
    });

    it('should return original zone for empty string', () => {
      expect(normalizeZone('')).toBe('');
    });
  });
});
