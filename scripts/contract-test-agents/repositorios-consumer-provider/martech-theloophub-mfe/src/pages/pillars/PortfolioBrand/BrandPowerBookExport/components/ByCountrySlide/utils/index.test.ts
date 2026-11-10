import { leftTableProcessing, rightTableProcessing } from './index';

const buildKpi = (
  label: string,
  rowsBlock: any[][] = [[{ id: `${label}-1` }]],
) =>
  ({
    performanceDetails: {
      header: [{ key: `${label}-header` }],
      rows: rowsBlock,
    },
  }) as any;

const baseLeftArgs = {
  nazKpiData: buildKpi('naz'),
  sazKpiData: buildKpi('saz'),
  mazKpiData: buildKpi('maz'),
  loading: false,
};

const baseRightArgs = {
  apacKpiData: buildKpi('apac', [[{ id: 'apac-1' }, { id: 'apac-2' }]]),
  afrKpiData: buildKpi('afr'),
  eurKpiData: buildKpi('eur'),
  loading: false,
};

describe('ByCountrySlide utils', () => {
  describe('leftTableProcessing', () => {
    it('returns an empty table when loading', () => {
      const result = leftTableProcessing({ ...baseLeftArgs, loading: true });

      expect(result).toEqual({ header: [], rows: [] });
    });

    it('uses the NAZ header as the resulting header', () => {
      const result = leftTableProcessing(baseLeftArgs);

      expect(result.header).toEqual([{ key: 'naz-header' }]);
    });

    it('flattens NAZ + SAZ + MAZ rows into a single row group', () => {
      const result = leftTableProcessing(baseLeftArgs);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toHaveLength(3);
    });

    it.each([
      ['NAZ', 0, true],
      ['SAZ', 1, true],
      ['MAZ', 2, false],
    ])(
      'tags the %s rows with the correct zone label and groupBorder=%s',
      (zone, index, hasGroupBorder) => {
        const result = leftTableProcessing(baseLeftArgs);

        const row = result.rows[0][index] as any;
        expect(row.label.value).toBe(zone);
        expect(Boolean(row.label.groupBorder)).toBe(hasGroupBorder);
      },
    );

    it('falls back to an empty table when a zone slot is missing', () => {
      const result = leftTableProcessing({
        ...baseLeftArgs,
        sazKpiData: undefined as any,
      });

      expect(result.rows[0].some((r: any) => r.label.value === 'SAZ')).toBe(
        false,
      );
    });

    it('returns an empty header and empty zone rows when all left KPIs are missing', () => {
      const result = leftTableProcessing({
        nazKpiData: undefined as any,
        sazKpiData: undefined as any,
        mazKpiData: undefined as any,
        loading: false,
      });

      expect(result.header).toEqual([]);
      expect(result.rows[0]).toEqual([]);
    });

    it('falls back to an empty header when the NAZ performanceDetails has no header field', () => {
      const result = leftTableProcessing({
        ...baseLeftArgs,
        nazKpiData: {
          performanceDetails: { rows: [[{ id: 'naz-1' }]] },
        } as any,
      });

      expect(result.header).toEqual([]);
    });

    it('skips a zone whose performanceDetails has no rows field', () => {
      const result = leftTableProcessing({
        ...baseLeftArgs,
        sazKpiData: {
          performanceDetails: { header: [{ key: 'saz-header' }] },
        } as any,
      });

      expect(result.rows[0].some((r: any) => r.label.value === 'SAZ')).toBe(
        false,
      );
    });
  });

  describe('rightTableProcessing', () => {
    it('returns an empty table when loading', () => {
      const result = rightTableProcessing({ ...baseRightArgs, loading: true });

      expect(result).toEqual({ header: [], rows: [] });
    });

    it('uses the APAC header as the resulting header', () => {
      const result = rightTableProcessing(baseRightArgs);

      expect(result.header).toEqual([{ key: 'apac-header' }]);
    });

    it.each([
      ['APAC', true],
      ['AFR', true],
      ['EUR', false],
    ])('tags the %s rows with groupBorder=%s', (zone, hasGroupBorder) => {
      const result = rightTableProcessing(baseRightArgs);

      const rowsForZone = (result.rows[0] as any[]).filter(
        (r) => r.label.value === zone,
      );
      expect(rowsForZone.length).toBeGreaterThan(0);
      rowsForZone.forEach((row) => {
        expect(Boolean(row.label.groupBorder)).toBe(hasGroupBorder);
      });
    });

    it('deep-flattens nested rows so every value receives a zone label', () => {
      const result = rightTableProcessing({
        ...baseRightArgs,
        apacKpiData: {
          performanceDetails: {
            header: [{ key: 'apac-header' }],
            rows: [[[{ id: 'deep-1' }], [{ id: 'deep-2' }]]],
          },
        } as any,
      });

      const apacRows = (result.rows[0] as any[]).filter(
        (r) => r.label.value === 'APAC',
      );
      expect(apacRows.length).toBe(2);
    });

    it('returns an empty header and empty zone rows when all right KPIs are missing', () => {
      const result = rightTableProcessing({
        apacKpiData: undefined as any,
        afrKpiData: undefined as any,
        eurKpiData: undefined as any,
        loading: false,
      });

      expect(result.header).toEqual([]);
      expect(result.rows[0]).toEqual([]);
    });

    it('falls back to an empty header when the APAC performanceDetails has no header field', () => {
      const result = rightTableProcessing({
        ...baseRightArgs,
        apacKpiData: {
          performanceDetails: { rows: [[{ id: 'apac-1' }]] },
        } as any,
      });

      expect(result.header).toEqual([]);
    });

    it('skips a zone whose performanceDetails has no rows field', () => {
      const result = rightTableProcessing({
        ...baseRightArgs,
        afrKpiData: {
          performanceDetails: { header: [{ key: 'afr-header' }] },
        } as any,
      });

      expect(
        (result.rows[0] as any[]).some((r) => r.label.value === 'AFR'),
      ).toBe(false);
    });
  });
});
