import { portfolioCellClass } from './portfolioCellClass';

describe('portfolioCellClass', () => {
  const createParams = (fieldValue: string, config?: Record<string, any>) =>
    ({
      colDef: { field: 'portfolio' },
      node: {
        data: { portfolio: fieldValue },
      },
      data: { portfolio_config: config },
    }) as any;

  it('should always include ag-cell-portfolio class', () => {
    const params = createParams('test');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-portfolio');
  });

  it('should add ag-cell-first-row when config has radiusTop', () => {
    const params = createParams('test', { radiusTop: true });

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-first-row');
  });

  it('should not add ag-cell-first-row when config has no radiusTop', () => {
    const params = createParams('test', {});

    const result = portfolioCellClass(params);

    expect(result).not.toContain('ag-cell-first-row');
  });

  it('should add ag-cell-megabrands for megabrands value', () => {
    const params = createParams('Megabrands');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-megabrands');
  });

  it('should add ag-cell-expansion for expansion value', () => {
    const params = createParams('Expansion');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-expansion');
  });

  it('should add ag-cell-sustain for sustain value', () => {
    const params = createParams('Sustain');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-sustain');
  });

  it('should add ag-cell-tail for tail value', () => {
    const params = createParams('Tail');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-tail');
  });

  it('should add ag-cell-total for total value', () => {
    const params = createParams('Total');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-total');
  });

  it('should handle lowercase values', () => {
    const params = createParams('megabrands');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-megabrands');
  });

  it('should handle uppercase values', () => {
    const params = createParams('EXPANSION');

    const result = portfolioCellClass(params);

    expect(result).toContain('ag-cell-expansion');
  });

  it('should not add specific class for unknown value', () => {
    const params = createParams('unknown');

    const result = portfolioCellClass(params);

    expect(result).toEqual(['ag-cell-portfolio']);
  });
});
