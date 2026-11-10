import type { TableHeaderType } from '../../types';
import { getDataTableHeaderTooltipConfig } from './getDataTableHeaderTooltipConfig';

describe('getDataTableHeaderTooltipConfig', () => {
  it('returns hasContent false when title and text are empty', () => {
    const column: TableHeaderType = { id: 'c', title: 'Col' };
    expect(getDataTableHeaderTooltipConfig(column)).toEqual({
      hasContent: false,
      title: undefined,
      text: undefined,
      indicatorColor: undefined,
      size: 'auto',
    });
  });

  it('returns hasContent true when only title is set', () => {
    const column: TableHeaderType = {
      id: 'c',
      title: 'Col',
      tooltipTitle: '  Tip  ',
    };
    const cfg = getDataTableHeaderTooltipConfig(column);
    expect(cfg.hasContent).toBe(true);
    expect(cfg.title).toBe('Tip');
    expect(cfg.size).toBe('auto');
  });

  it('uses medium size when both title and body exist', () => {
    const column: TableHeaderType = {
      id: 'c',
      title: 'Col',
      tooltipTitle: 'T',
      tooltipContent: 'Body',
    };
    const cfg = getDataTableHeaderTooltipConfig(column);
    expect(cfg.size).toBe('medium');
    expect(cfg.hasContent).toBe(true);
  });

  it('inherits indicator color from parent when column has no color', () => {
    const column: TableHeaderType = {
      id: 'c',
      title: 'Col',
      tooltipTitle: 'T',
      tooltipContent: 'B',
    };
    expect(
      getDataTableHeaderTooltipConfig(column, ' #abc ').indicatorColor,
    ).toBe(' #abc ');
  });

  it('uses column color over parent color', () => {
    const column: TableHeaderType = {
      id: 'c',
      title: 'Col',
      tooltipTitle: 'T',
      color: 'red',
    };
    expect(getDataTableHeaderTooltipConfig(column, 'blue').indicatorColor).toBe(
      'red',
    );
  });
});
