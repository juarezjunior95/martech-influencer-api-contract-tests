import React from 'react';

import { render } from '@testing-library/react';

import { tooltipValueGetter } from './tooltipValueGetter';

describe('tooltipValueGetter utility', () => {
  const createMockParams = (value: any, field = 'portfolio') => {
    return {
      data: {
        [field]: value,
      },
      colDef: { field },
    };
  };

  describe('Megabrands', () => {
    it('should return correct tooltip for megabrands', () => {
      const params = createMockParams('megabrands');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit both scale and growth.');
    });

    it('should handle MEGABRANDS in uppercase', () => {
      const params = createMockParams('MEGABRANDS');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit both scale and growth.');
    });

    it('should handle MegaBrands in mixed case', () => {
      const params = createMockParams('MegaBrands');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit both scale and growth.');
    });

    it('should return div element for megabrands', () => {
      const params = createMockParams('megabrands');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Expansion', () => {
    it('should return correct tooltip for expansion', () => {
      const params = createMockParams('expansion');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit growth but no scale.');
    });

    it('should handle EXPANSION in uppercase', () => {
      const params = createMockParams('EXPANSION');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit growth but no scale.');
    });

    it('should handle Expansion in mixed case', () => {
      const params = createMockParams('Expansion');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit growth but no scale.');
    });

    it('should return div element for expansion', () => {
      const params = createMockParams('expansion');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Sustain', () => {
    it('should return correct tooltip for sustain', () => {
      const params = createMockParams('sustain');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit scale but low growth.');
    });

    it('should handle SUSTAIN in uppercase', () => {
      const params = createMockParams('SUSTAIN');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit scale but low growth.');
    });

    it('should handle Sustain in mixed case', () => {
      const params = createMockParams('Sustain');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit scale but low growth.');
    });

    it('should return div element for sustain', () => {
      const params = createMockParams('sustain');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Tail', () => {
    it('should return correct tooltip for tail', () => {
      const params = createMockParams('tail');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit neither scale nor growth.');
    });

    it('should handle TAIL in uppercase', () => {
      const params = createMockParams('TAIL');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit neither scale nor growth.');
    });

    it('should handle Tail in mixed case', () => {
      const params = createMockParams('Tail');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit neither scale nor growth.');
    });

    it('should return div element for tail', () => {
      const params = createMockParams('tail');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Unknown Values', () => {
    it('should return empty string for unknown value', () => {
      const params = createMockParams('unknown');

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });

    it('should return empty string for total value', () => {
      const params = createMockParams('total');

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });

    it('should return empty string for empty string value', () => {
      const params = createMockParams('');

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });

    it('should return empty string for null value', () => {
      const params = createMockParams(null);

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });

    it('should return empty string for undefined value', () => {
      const params = createMockParams(undefined);

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for numeric value', () => {
      const params = createMockParams(123);

      expect(() => tooltipValueGetter(params)).toThrow();
    });

    it('should throw error for object value', () => {
      const params = createMockParams({ name: 'test' });

      expect(() => tooltipValueGetter(params)).toThrow();
    });

    it('should not match value with leading/trailing spaces', () => {
      const params = createMockParams(' megabrands ');

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });

    it('should handle different field names', () => {
      const params = createMockParams('expansion', 'custom_field');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      expect(container.textContent).toBe('Exhibit growth but no scale.');
    });

    it('should handle missing data field', () => {
      const params = {
        data: {},
        colDef: { field: 'portfolio' },
      };

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });
  });

  describe('JSX Structure', () => {
    it('should return React element for valid portfolio types', () => {
      const values = ['megabrands', 'expansion', 'sustain', 'tail'];

      values.forEach((value) => {
        const params = createMockParams(value);
        const result = tooltipValueGetter(params);

        expect(React.isValidElement(result)).toBe(true);
      });
    });

    it('should return string (not React element) for invalid values', () => {
      const params = createMockParams('unknown');

      const result = tooltipValueGetter(params);

      expect(typeof result).toBe('string');
      expect(React.isValidElement(result)).toBe(false);
    });

    it('should have correct structure for megabrands tooltip', () => {
      const params = createMockParams('megabrands');

      const result = tooltipValueGetter(params);
      const { container } = render(<>{result}</>);

      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
      expect(div?.tagName).toBe('DIV');
    });
  });

  describe('All Portfolio Types', () => {
    it('should return correct tooltips for all portfolio types', () => {
      const types = [
        { value: 'megabrands', text: 'Exhibit both scale and growth.' },
        { value: 'expansion', text: 'Exhibit growth but no scale.' },
        { value: 'sustain', text: 'Exhibit scale but low growth.' },
        { value: 'tail', text: 'Exhibit neither scale nor growth.' },
      ];

      types.forEach(({ value, text }) => {
        const params = createMockParams(value);
        const result = tooltipValueGetter(params);
        const { container } = render(<>{result}</>);

        expect(container.textContent).toBe(text);
      });
    });
  });

  describe('Return Types', () => {
    it('should return JSX element for megabrands', () => {
      const params = createMockParams('megabrands');
      const result = tooltipValueGetter(params);

      expect(result).toEqual(<div>Exhibit both scale and growth.</div>);
    });

    it('should return JSX element for expansion', () => {
      const params = createMockParams('expansion');
      const result = tooltipValueGetter(params);

      expect(result).toEqual(<div>Exhibit growth but no scale.</div>);
    });

    it('should return JSX element for sustain', () => {
      const params = createMockParams('sustain');
      const result = tooltipValueGetter(params);

      expect(result).toEqual(<div>Exhibit scale but low growth.</div>);
    });

    it('should return JSX element for tail', () => {
      const params = createMockParams('tail');
      const result = tooltipValueGetter(params);

      expect(result).toEqual(<div>Exhibit neither scale nor growth.</div>);
    });

    it('should return empty string for non-matching values', () => {
      const params = createMockParams('invalid');
      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });
  });
});
