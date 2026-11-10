import type { TableDataType } from 'components/TableComponent';
import { SUB_COLUMN_WIDTH } from 'components/TableComponent/components/FlexTableLayout/FlexTableLayout';

import { PARTICIPATION_BREAKDOWN_BRAND_PALETTE } from '../constants';
import { applyBrandColumnColors } from './applyBrandColumnColors';

const buildHeader = (
  overrides: Partial<TableDataType['header'][number]> = {},
): TableDataType['header'][number] => ({
  id: 'col',
  title: 'Column',
  children: [{ id: 'col_volume', title: 'Volume' }],
  ...overrides,
});

const buildData = (
  header: TableDataType['header'],
  rows: TableDataType['rows'] = [],
): TableDataType => ({ header, rows });

describe('applyBrandColumnColors', () => {
  test('should set align right on axis column (no children)', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      buildHeader({ id: 'beer', title: 'Beer' }),
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[0]).toEqual({
      id: 'segment',
      title: '',
      align: 'right',
    });
  });

  test('should assign palette colors in order to brand columns', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      buildHeader({ id: 'beer', title: 'Beer' }),
      buildHeader({ id: 'coreCo', title: 'Core Co' }),
      buildHeader({ id: 'brahma', title: 'Brahma' }),
      buildHeader({ id: 'amstel', title: 'Amstel' }),
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    );
    expect(result.header[2].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[1],
    );
    expect(result.header[3].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[2],
    );
    expect(result.header[4].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[3],
    );
  });

  test('should override any color already provided by the BFF', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      buildHeader({ id: 'beer', title: 'Beer', color: '#000000' }),
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    );
  });

  test('should cycle through the palette when there are more brands than colors', () => {
    const palette = PARTICIPATION_BREAKDOWN_BRAND_PALETTE;
    const data = buildData([
      { id: 'segment', title: '' },
      ...Array.from({ length: palette.length + 2 }, (_, idx) =>
        buildHeader({ id: `b${idx}`, title: `Brand ${idx}` }),
      ),
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].color).toBe(palette[0]);
    expect(result.header[palette.length + 1].color).toBe(palette[0]);
    expect(result.header[palette.length + 2].color).toBe(palette[1]);
  });

  test('should not assign colors to leaf columns without children', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      { id: 'plain', title: 'Plain Column' },
      buildHeader({ id: 'beer', title: 'Beer' }),
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].color).toBeUndefined();
    expect(result.header[2].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    );
  });

  test('should preserve every other header field besides color', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      buildHeader({
        id: 'beer',
        title: 'Beer',
        align: 'center',
        tooltipTitle: 'Beer portfolio',
        tooltipContent: 'Description',
      }),
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1]).toEqual({
      id: 'beer',
      title: 'Beer',
      align: 'center',
      tooltipTitle: 'Beer portfolio',
      tooltipContent: 'Description',
      children: [
        {
          id: 'col_volume',
          title: 'Volume',
          align: 'right',
          color: PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
        },
      ],
      color: PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    });
  });

  test('should not assign width when the brand has a single sub-column', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      {
        id: 'beer',
        title: 'Beer',
        children: [{ id: 'beer_volume', title: 'Volume' }],
      },
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].children?.[0].width).toBeUndefined();
  });

  test('should set align right on the Volume child (index 0) and center on the Index child (index 1)', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      {
        id: 'beer',
        title: 'Beer',
        children: [
          { id: 'beer_volume', title: 'Volume' },
          { id: 'beer_index', title: 'Index' },
        ],
      },
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].children?.[0].align).toBe('right');
    expect(result.header[1].children?.[1].align).toBe('center');
  });

  test('should set primary width on Volume child and secondary width on Index child', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      {
        id: 'beer',
        title: 'Beer',
        children: [
          { id: 'beer_volume', title: 'Volume' },
          { id: 'beer_index', title: 'Index' },
        ],
      },
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].children?.[0].width).toBe(SUB_COLUMN_WIDTH.PRIMARY);
    expect(result.header[1].children?.[1].width).toBe(
      SUB_COLUMN_WIDTH.SECONDARY,
    );
  });

  test('should override existing child align: Volume always right, Index always center', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      {
        id: 'beer',
        title: 'Beer',
        children: [
          { id: 'beer_volume', title: 'Volume', align: 'center' },
          { id: 'beer_index', title: 'Index', align: 'right' },
        ],
      },
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].children?.[0].align).toBe('right');
    expect(result.header[1].children?.[1].align).toBe('center');
  });

  test('should propagate brand color to the Volume child (index 0) only', () => {
    const data = buildData([
      { id: 'segment', title: '' },
      {
        id: 'beer',
        title: 'Beer',
        children: [
          { id: 'beer_volume', title: 'Volume' },
          { id: 'beer_index', title: 'Index' },
        ],
      },
    ]);

    const result = applyBrandColumnColors(data);

    expect(result.header[1].children?.[0].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    );
    expect(result.header[1].children?.[1].color).toBeUndefined();
  });

  test('should keep the rows reference unchanged and only swap the header', () => {
    const rows: TableDataType['rows'] = [[{ segment: { value: 'Male' } }]];
    const data = buildData(
      [
        { id: 'segment', title: '' },
        buildHeader({ id: 'beer', title: 'Beer' }),
      ],
      rows,
    );

    const result = applyBrandColumnColors(data);

    expect(result.rows).toBe(rows);
    expect(result.header).not.toBe(data.header);
  });
});
