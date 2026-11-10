import { RESPONSIVE_BREAKPOINTS, RESPONSIVE_CONFIGS } from './responsiveSizes';

describe('responsiveSizes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RESPONSIVE_BREAKPOINTS', () => {
    it('has medium breakpoint at 200', () => {
      expect(RESPONSIVE_BREAKPOINTS.medium).toBe(200);
    });

    it('has large breakpoint at 400', () => {
      expect(RESPONSIVE_BREAKPOINTS.large).toBe(400);
    });

    it('has responsive breakpoint at 700', () => {
      expect(RESPONSIVE_BREAKPOINTS.responsive).toBe(700);
    });
  });

  describe('RESPONSIVE_CONFIGS', () => {
    const sizes = ['small', 'medium', 'large', 'responsive'] as const;

    it.each(sizes)('"%s" has all required properties', (size) => {
      const config = RESPONSIVE_CONFIGS[size];

      expect(config).toHaveProperty('columnWidth');
      expect(config).toHaveProperty('columnSpacing');
      expect(config).toHaveProperty('fontSize');
      expect(config).toHaveProperty('fontSize.label');
      expect(config).toHaveProperty('fontSize.value');
      expect(config).toHaveProperty('fontSize.variation');
      expect(config).toHaveProperty('padding');
      expect(config).toHaveProperty('padding.top');
      expect(config).toHaveProperty('padding.right');
      expect(config).toHaveProperty('padding.bottom');
      expect(config).toHaveProperty('padding.left');
      expect(config).toHaveProperty('borderRadius');
      expect(config).toHaveProperty('minCellHeight');
    });

    it.each(sizes)('"%s" has numeric columnWidth', (size) => {
      expect(typeof RESPONSIVE_CONFIGS[size].columnWidth).toBe('number');
    });

    it.each(sizes)('"%s" has numeric columnSpacing', (size) => {
      expect(typeof RESPONSIVE_CONFIGS[size].columnSpacing).toBe('number');
    });

    it.each(sizes)('"%s" has numeric borderRadius', (size) => {
      expect(typeof RESPONSIVE_CONFIGS[size].borderRadius).toBe('number');
    });

    it('small has correct values', () => {
      expect(RESPONSIVE_CONFIGS.small).toEqual({
        columnWidth: 36,
        columnSpacing: 8,
        fontSize: { label: 12, value: 12, variation: 12 },
        padding: { top: 52, right: 8, bottom: 4, left: 8 },
        borderRadius: 4,
        minCellHeight: 8,
      });
    });

    it('medium has correct values', () => {
      expect(RESPONSIVE_CONFIGS.medium).toEqual({
        columnWidth: 54,
        columnSpacing: 12,
        fontSize: { label: 12, value: 12, variation: 12 },
        padding: { top: 55, right: 16, bottom: 4, left: 16 },
        borderRadius: 6,
        minCellHeight: 8,
      });
    });

    it('large has correct values', () => {
      expect(RESPONSIVE_CONFIGS.large).toEqual({
        columnWidth: 72,
        columnSpacing: 16,
        fontSize: { label: 12, value: 12, variation: 12 },
        padding: { top: 64, right: 24, bottom: 4, left: 24 },
        borderRadius: 8,
        minCellHeight: 8,
      });
    });

    it('responsive has correct values', () => {
      expect(RESPONSIVE_CONFIGS.responsive).toEqual({
        columnWidth: 112,
        columnSpacing: 20,
        fontSize: { label: 12, value: 12, variation: 12 },
        padding: { top: 60, right: 32, bottom: 4, left: 32 },
        borderRadius: 8,
        minCellHeight: 8,
      });
    });

    it('columnWidth increases with size', () => {
      expect(RESPONSIVE_CONFIGS.small.columnWidth).toBeLessThan(
        RESPONSIVE_CONFIGS.medium.columnWidth,
      );
      expect(RESPONSIVE_CONFIGS.medium.columnWidth).toBeLessThan(
        RESPONSIVE_CONFIGS.large.columnWidth,
      );
      expect(RESPONSIVE_CONFIGS.large.columnWidth).toBeLessThan(
        RESPONSIVE_CONFIGS.responsive.columnWidth,
      );
    });

    it('columnSpacing increases with size', () => {
      expect(RESPONSIVE_CONFIGS.small.columnSpacing).toBeLessThan(
        RESPONSIVE_CONFIGS.medium.columnSpacing,
      );
      expect(RESPONSIVE_CONFIGS.medium.columnSpacing).toBeLessThan(
        RESPONSIVE_CONFIGS.large.columnSpacing,
      );
      expect(RESPONSIVE_CONFIGS.large.columnSpacing).toBeLessThan(
        RESPONSIVE_CONFIGS.responsive.columnSpacing,
      );
    });
  });
});
