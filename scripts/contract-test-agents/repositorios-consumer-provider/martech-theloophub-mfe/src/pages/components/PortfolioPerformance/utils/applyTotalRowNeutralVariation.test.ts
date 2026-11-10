import type { TableDataType } from 'components/Table/types';

import { applyTotalRowNeutralVariationColor } from './applyTotalRowNeutralVariation';

describe('applyTotalRowNeutralVariationColor', () => {
  it('should set variationColor neutral on Total row for the three 100% metrics', () => {
    const input: TableDataType = {
      header: [],
      rows: [
        [
          {
            portfolio: { value: 'Total' },
            volume_growth_contr: { value: 100, unitMeasure: '%' },
            volume_weight: { value: 100, unitMeasure: '%' },
            sm_weight: { value: 100, unitMeasure: '%' },
          },
        ],
      ],
    };
    const out = applyTotalRowNeutralVariationColor(input);
    const row = out.rows![0][0] as Record<string, { variationColor?: string }>;
    expect(row.volume_growth_contr.variationColor).toBe('neutral');
    expect(row.volume_weight.variationColor).toBe('neutral');
    expect(row.sm_weight.variationColor).toBe('neutral');
  });

  it('should not set neutral when Total row value is not 100', () => {
    const input: TableDataType = {
      header: [],
      rows: [
        [
          {
            portfolio: { value: 'Total' },
            volume_growth_contr: { value: 85, unitMeasure: '%' },
            volume_weight: { value: 100, unitMeasure: '%' },
            sm_weight: { value: 50, unitMeasure: '%' },
          },
        ],
      ],
    };
    const out = applyTotalRowNeutralVariationColor(input);
    const row = out.rows![0][0] as Record<string, { variationColor?: string }>;
    expect(row.volume_growth_contr.variationColor).toBeUndefined();
    expect(row.volume_weight.variationColor).toBe('neutral');
    expect(row.sm_weight.variationColor).toBeUndefined();
  });

  it('should skip empty rows', () => {
    const input: TableDataType = {
      header: [],
      rows: [[{ isEmpty: true }]],
    };
    const out = applyTotalRowNeutralVariationColor(input);
    expect(out.rows![0][0]).toEqual({ isEmpty: true });
  });

  it('should return data unchanged when rows is empty', () => {
    const input: TableDataType = { header: [], rows: [] };
    expect(applyTotalRowNeutralVariationColor(input)).toBe(input);
  });
});
