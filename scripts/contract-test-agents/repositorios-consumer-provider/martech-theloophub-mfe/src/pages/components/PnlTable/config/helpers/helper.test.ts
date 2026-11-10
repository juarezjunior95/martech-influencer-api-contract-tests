import { customRowHeight } from './helper';

describe('customRowHeight', () => {
  it('should return 120 for first row when isExportPage is true', () => {
    const params = { node: { rowIndex: 0 } } as any;

    const result = customRowHeight(params, 'brands', true);

    expect(result).toBe(120);
  });

  it('should return 24 for non-first row when isExportPage is true', () => {
    const params = { node: { rowIndex: 1 } } as any;

    const result = customRowHeight(params, 'brands', true);

    expect(result).toBe(24);
  });
});
