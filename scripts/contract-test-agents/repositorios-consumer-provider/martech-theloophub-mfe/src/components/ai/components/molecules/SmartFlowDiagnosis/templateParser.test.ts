import type { LabelValuePair, QueryParameter } from 'models/InsightsCopilot';

import {
  parseTemplate,
  resolveTemplate,
  sortDropdownValues,
} from './templateParser';

describe('templateParser', () => {
  describe('parseTemplate', () => {
    it('parses simple @key placeholders', () => {
      const result = parseTemplate('Sales for @brand');
      expect(result).toEqual([
        { type: 'text', content: 'Sales for ' },
        { type: 'placeholder', content: 'brand' },
      ]);
    });

    it('parses conditional block {text @key}', () => {
      const result = parseTemplate('Sales {in @region}');
      expect(result).toEqual([
        { type: 'text', content: 'Sales ' },
        { type: 'text', content: 'in ' },
        { type: 'placeholder', content: 'region' },
      ]);
    });

    it('parses conditional block {text @key suffix}', () => {
      const result = parseTemplate('Data {of @brand here}');
      expect(result).toEqual([
        { type: 'text', content: 'Data ' },
        { type: 'text', content: 'of ' },
        { type: 'placeholder', content: 'brand' },
        { type: 'text', content: ' here' },
      ]);
    });

    it('parses multiple placeholders', () => {
      const result = parseTemplate('Sales for @brand in @region');
      expect(result).toEqual([
        { type: 'text', content: 'Sales for ' },
        { type: 'placeholder', content: 'brand' },
        { type: 'text', content: ' in ' },
        { type: 'placeholder', content: 'region' },
      ]);
    });

    it('parses mixed blocks and standalone', () => {
      const result = parseTemplate('Highlights of @brand {in @country}');
      expect(result).toEqual([
        { type: 'text', content: 'Highlights of ' },
        { type: 'placeholder', content: 'brand' },
        { type: 'text', content: ' ' },
        { type: 'text', content: 'in ' },
        { type: 'placeholder', content: 'country' },
      ]);
    });

    it('strips braces from {text @key} blocks', () => {
      const result = parseTemplate('Show {of @brand} {for @period}');
      const texts = result
        .filter((p) => p.type === 'text')
        .map((p) => p.content);
      expect(texts.join('')).not.toContain('{');
      expect(texts.join('')).not.toContain('}');
    });

    it('returns single text part for no placeholders', () => {
      const result = parseTemplate('plain text');
      expect(result).toEqual([{ type: 'text', content: 'plain text' }]);
    });

    it('handles empty string', () => {
      const result = parseTemplate('');
      expect(result).toEqual([]);
    });

    it('handles placeholder at start', () => {
      const result = parseTemplate('@brand sales');
      expect(result).toEqual([
        { type: 'placeholder', content: 'brand' },
        { type: 'text', content: ' sales' },
      ]);
    });

    it('treats {@ without key} as text', () => {
      const result = parseTemplate('Show {@ stuff}');
      expect(result).toEqual([{ type: 'text', content: 'Show {@ stuff}' }]);
    });

    it('treats unclosed brace as text', () => {
      const result = parseTemplate('Sales {in @brand');
      expect(result).toEqual([
        { type: 'text', content: 'Sales {in ' },
        { type: 'placeholder', content: 'brand' },
      ]);
    });

    it('treats standalone @ without key as text', () => {
      const result = parseTemplate('email@ test');
      expect(result).toEqual([{ type: 'text', content: 'email@ test' }]);
    });

    it('treats braces without @ as text', () => {
      const result = parseTemplate('Show {no placeholder}');
      expect(result).toEqual([
        { type: 'text', content: 'Show {no placeholder}' },
      ]);
    });
  });

  describe('resolveTemplate', () => {
    const makeParam = (
      overrides: Partial<QueryParameter> = {},
    ): QueryParameter => ({
      input_type: 'static',
      placeholder_text: 'Select...',
      is_mandatory: false,
      allow_multiselect: false,
      default_options: [],
      ...overrides,
    });

    it('resolves @key with selected values', () => {
      const params = { '@brand': makeParam() };
      const selected = {
        '@brand': [{ label: 'Budweiser', value: 'bud' }],
      };
      expect(resolveTemplate('Sales for @brand', params, selected)).toBe(
        'Sales for Budweiser',
      );
    });

    it('resolves multi-select with comma join', () => {
      const params = {
        '@brand': makeParam({ allow_multiselect: true }),
      };
      const selected = {
        '@brand': [
          { label: 'Bud', value: 'bud' },
          { label: 'Corona', value: 'cor' },
        ],
      };
      expect(resolveTemplate('Sales for @brand', params, selected)).toBe(
        'Sales for Bud, Corona',
      );
    });

    it('removes conditional block when param is empty', () => {
      const params = { '@region': makeParam() };
      const selected: Record<string, LabelValuePair[]> = {};
      expect(resolveTemplate('Sales {in @region}', params, selected)).toBe(
        'Sales',
      );
    });

    it('keeps conditional block when param has value', () => {
      const params = { '@region': makeParam() };
      const selected = {
        '@region': [{ label: 'US', value: 'us' }],
      };
      expect(resolveTemplate('Sales {in @region}', params, selected)).toBe(
        'Sales in US',
      );
    });

    it('shows placeholder text when empty and no braces', () => {
      const params = {
        '@brand': makeParam({
          placeholder_text: 'select brand',
        }),
      };
      const selected: Record<string, LabelValuePair[]> = {};
      expect(resolveTemplate('Sales for @brand', params, selected)).toBe(
        'Sales for select brand',
      );
    });

    it('collapses multiple spaces after removing block', () => {
      const params = { '@region': makeParam() };
      const selected: Record<string, LabelValuePair[]> = {};
      expect(
        resolveTemplate('Sales  {in @region}  now', params, selected),
      ).toBe('Sales now');
    });

    it('falls back to @key when no param defined', () => {
      expect(resolveTemplate('Sales for @brand', {}, {})).toBe(
        'Sales for @brand',
      );
    });
  });

  describe('sortDropdownValues', () => {
    const opt = (label: string): LabelValuePair => ({
      label,
      value: label.toLowerCase(),
    });

    it('puts defaults first', () => {
      const result = sortDropdownValues([opt('A')], [opt('B'), opt('C')]);
      expect(result.map((r) => r.label)).toEqual(['A', 'B', 'C']);
    });

    it('removes duplicates from statics', () => {
      const result = sortDropdownValues([opt('A')], [opt('A'), opt('B')]);
      expect(result.map((r) => r.label)).toEqual(['A', 'B']);
    });

    it('removes duplicates from searched', () => {
      const result = sortDropdownValues(
        [opt('A')],
        [opt('B')],
        [opt('A'), opt('C')],
      );
      expect(result.map((r) => r.label)).toEqual(['A', 'B', 'C']);
    });

    it('handles empty arrays', () => {
      const result = sortDropdownValues([], [], []);
      expect(result).toEqual([]);
    });
  });
});
