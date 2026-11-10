import { CellClassParams } from 'ag-grid-community';

import { portfolioCellClass } from './portfolioCellClass';

describe('portfolioCellClass utility', () => {
  const createMockParams = (
    value: any,
    config?: any,
    field = 'portfolio',
  ): CellClassParams => {
    return {
      node: {
        data: {
          [field]: value,
        },
      } as any,
      colDef: { field },
      data: config ? { portfolio_config: config } : {},
    } as CellClassParams;
  };

  describe('Base Class', () => {
    it('should always include ag-cell-portfolio class', () => {
      const params = createMockParams('test');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
    });

    it('should include ag-cell-portfolio even with no value', () => {
      const params = createMockParams(null);

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
    });

    it('should include ag-cell-portfolio as first class', () => {
      const params = createMockParams('megabrands');

      const result = portfolioCellClass(params);

      expect(result[0]).toBe('ag-cell-portfolio');
    });
  });

  describe('RadiusTop Config', () => {
    it('should add ag-cell-first-row when radiusTop is true', () => {
      const params = createMockParams('test', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });

    it('should not add ag-cell-first-row when radiusTop is false', () => {
      const params = createMockParams('test', { radiusTop: false });

      const result = portfolioCellClass(params);

      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should not add ag-cell-first-row when radiusTop is undefined', () => {
      const params = createMockParams('test', {});

      const result = portfolioCellClass(params);

      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should not add ag-cell-first-row when config is undefined', () => {
      const params = createMockParams('test');

      const result = portfolioCellClass(params);

      expect(result).not.toContain('ag-cell-first-row');
    });
  });

  describe('Megabrands Value', () => {
    it('should add ag-cell-megabrands for megabrands value', () => {
      const params = createMockParams('megabrands');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-megabrands');
    });

    it('should handle MEGABRANDS in uppercase', () => {
      const params = createMockParams('MEGABRANDS');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-megabrands');
    });

    it('should handle MegaBrands in mixed case', () => {
      const params = createMockParams('MegaBrands');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-megabrands');
    });
  });

  describe('Expansion Value', () => {
    it('should add ag-cell-expansion for expansion value', () => {
      const params = createMockParams('expansion');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-expansion');
    });

    it('should handle EXPANSION in uppercase', () => {
      const params = createMockParams('EXPANSION');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-expansion');
    });

    it('should handle Expansion in mixed case', () => {
      const params = createMockParams('Expansion');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-expansion');
    });
  });

  describe('Sustain Value', () => {
    it('should add ag-cell-sustain for sustain value', () => {
      const params = createMockParams('sustain');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-sustain');
    });

    it('should handle SUSTAIN in uppercase', () => {
      const params = createMockParams('SUSTAIN');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-sustain');
    });

    it('should handle Sustain in mixed case', () => {
      const params = createMockParams('Sustain');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-sustain');
    });
  });

  describe('Tail Value', () => {
    it('should add ag-cell-tail for tail value', () => {
      const params = createMockParams('tail');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-tail');
    });

    it('should handle TAIL in uppercase', () => {
      const params = createMockParams('TAIL');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-tail');
    });

    it('should handle Tail in mixed case', () => {
      const params = createMockParams('Tail');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-tail');
    });
  });

  describe('Total Value', () => {
    it('should add ag-cell-total for total value', () => {
      const params = createMockParams('total');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-total');
    });

    it('should handle TOTAL in uppercase', () => {
      const params = createMockParams('TOTAL');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-total');
    });

    it('should handle Total in mixed case', () => {
      const params = createMockParams('Total');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-total');
    });
  });

  describe('Unknown Values', () => {
    it('should only include base class for unknown value', () => {
      const params = createMockParams('unknown');

      const result = portfolioCellClass(params);

      expect(result).toEqual(['ag-cell-portfolio']);
    });

    it('should handle empty string value', () => {
      const params = createMockParams('');

      const result = portfolioCellClass(params);

      expect(result).toEqual(['ag-cell-portfolio']);
    });

    it('should handle null value', () => {
      const params = createMockParams(null);

      const result = portfolioCellClass(params);

      expect(result).toEqual(['ag-cell-portfolio']);
    });

    it('should handle undefined value', () => {
      const params = createMockParams(undefined);

      const result = portfolioCellClass(params);

      expect(result).toEqual(['ag-cell-portfolio']);
    });
  });

  describe('Combined Scenarios', () => {
    it('should add both first-row and megabrands classes', () => {
      const params = createMockParams('megabrands', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-megabrands');
    });

    it('should add both first-row and expansion classes', () => {
      const params = createMockParams('expansion', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-expansion');
    });

    it('should add both first-row and sustain classes', () => {
      const params = createMockParams('sustain', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-sustain');
    });

    it('should add both first-row and tail classes', () => {
      const params = createMockParams('tail', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-tail');
    });

    it('should add both first-row and total classes', () => {
      const params = createMockParams('total', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-total');
    });

    it('should handle radiusTop true with unknown value', () => {
      const params = createMockParams('unknown', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result).toEqual(['ag-cell-portfolio', 'ag-cell-first-row']);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for numeric value', () => {
      const params = createMockParams(123);

      expect(() => portfolioCellClass(params)).toThrow();
    });

    it('should throw error for object value', () => {
      const params = createMockParams({ name: 'test' });

      expect(() => portfolioCellClass(params)).toThrow();
    });

    it('should handle value with leading/trailing spaces', () => {
      const params = createMockParams(' megabrands ');

      const result = portfolioCellClass(params);

      // toLowerCase on ' megabrands ' becomes ' megabrands ' which won't match
      expect(result).not.toContain('ag-cell-megabrands');
    });

    it('should handle config with other properties', () => {
      const params = createMockParams('megabrands', {
        radiusTop: true,
        otherProp: 'value',
      });

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-megabrands');
    });

    it('should handle null config', () => {
      const params = createMockParams('megabrands', null);

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-megabrands');
      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should handle missing node data field', () => {
      const params = {
        node: {
          data: {},
        } as any,
        colDef: { field: 'portfolio' },
        data: {},
      } as CellClassParams;

      const result = portfolioCellClass(params);

      expect(result).toEqual(['ag-cell-portfolio']);
    });

    it('should handle different field names', () => {
      const params = createMockParams('megabrands', undefined, 'custom_field');

      const result = portfolioCellClass(params);

      expect(result).toContain('ag-cell-portfolio');
      expect(result).toContain('ag-cell-megabrands');
    });
  });

  describe('Class Order', () => {
    it('should have ag-cell-portfolio first, then radiusTop, then value class', () => {
      const params = createMockParams('megabrands', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result[0]).toBe('ag-cell-portfolio');
      expect(result[1]).toBe('ag-cell-first-row');
      expect(result[2]).toBe('ag-cell-megabrands');
    });

    it('should have correct order without radiusTop', () => {
      const params = createMockParams('expansion');

      const result = portfolioCellClass(params);

      expect(result[0]).toBe('ag-cell-portfolio');
      expect(result[1]).toBe('ag-cell-expansion');
    });

    it('should have correct order with radiusTop but no value match', () => {
      const params = createMockParams('unknown', { radiusTop: true });

      const result = portfolioCellClass(params);

      expect(result[0]).toBe('ag-cell-portfolio');
      expect(result[1]).toBe('ag-cell-first-row');
      expect(result).toHaveLength(2);
    });
  });

  describe('All Portfolio Types', () => {
    it('should handle all portfolio types correctly', () => {
      const types = [
        { value: 'megabrands', class: 'ag-cell-megabrands' },
        { value: 'expansion', class: 'ag-cell-expansion' },
        { value: 'sustain', class: 'ag-cell-sustain' },
        { value: 'tail', class: 'ag-cell-tail' },
        { value: 'total', class: 'ag-cell-total' },
      ];

      types.forEach(({ value, class: expectedClass }) => {
        const params = createMockParams(value);
        const result = portfolioCellClass(params);

        expect(result).toContain('ag-cell-portfolio');
        expect(result).toContain(expectedClass);
      });
    });
  });
});
