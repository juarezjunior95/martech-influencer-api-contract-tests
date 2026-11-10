import { render } from '@testing-library/react';
import { Legend } from 'components/Chart/components/Legend/Legend';
import { ComparisonLine } from 'components/ComparisonLine';

import { StackedArea } from '../StackedArea';
import type { StackedAreaData } from '../types';
import { StackedAreaBody } from './StackedAreaBody';

jest.mock('../StackedArea', () => ({
  StackedArea: jest.fn((props: any) => <div data-testid="stacked-area" />),
}));

jest.mock('components/Chart/components/Legend/Legend', () => ({
  Legend: jest.fn((props: any) => <div data-testid="legend" />),
}));

jest.mock('components/ComparisonLine', () => ({
  ComparisonLine: jest.fn((props: any) => (
    <div data-testid="comparison-line" />
  )),
}));

jest.mock('./StackedAreaBody.styles', () => ({
  StyledChartWrapper: jest.fn(({ children }: any) => (
    <div data-testid="styled-wrapper">{children}</div>
  )),
  StyledLegendWrapper: jest.fn(({ children }: any) => (
    <div data-testid="styled-legend-wrapper">{children}</div>
  )),
}));

const baseData: StackedAreaData = {
  columns: [
    { label: '2024', segments: [{ value: 50 }, { value: 50 }] },
    { label: '2025', segments: [{ value: 30 }, { value: 70 }] },
  ],
  colors: ['#EFD328', '#D9AA4A'],
  connectorColors: ['#F0DF78', '#EEC879'],
};

describe('StackedAreaBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders StackedArea with data', () => {
    render(<StackedAreaBody data={baseData} />);

    expect(StackedArea).toHaveBeenCalledWith(
      expect.objectContaining({ data: baseData }),
      expect.anything(),
    );
  });

  it('does not render Legend when legends are absent', () => {
    render(<StackedAreaBody data={baseData} />);

    expect(Legend).not.toHaveBeenCalled();
  });

  it('renders Legend with correct caption items when legends are present', () => {
    const dataWithLegends: StackedAreaData = {
      ...baseData,
      legends: ['Beer', 'Wine'],
    };

    render(<StackedAreaBody data={dataWithLegends} />);

    expect(Legend).toHaveBeenCalledWith(
      expect.objectContaining({
        caption: [
          { label: 'Beer', color: '#EFD328', pointStyle: 'roundedRectangle' },
          { label: 'Wine', color: '#D9AA4A', pointStyle: 'roundedRectangle' },
        ],
        legendPosition: 'center',
      }),
      expect.anything(),
    );
  });

  it('does not render ComparisonLine when comparisonLine is absent', () => {
    render(<StackedAreaBody data={baseData} />);

    expect(ComparisonLine).not.toHaveBeenCalled();
  });

  it('renders ComparisonLine when comparisonLine is present', () => {
    const dataWithComparison: StackedAreaData = {
      ...baseData,
      comparisonLine: [
        {
          title: 'Beer vs LY',
          data: [
            { value: '-', measure: '', color: '#5C5C5C' },
            { value: '0.1', measure: 'pp', color: '#49764B' },
          ],
        },
      ],
    };

    render(<StackedAreaBody data={dataWithComparison} />);

    expect(ComparisonLine).toHaveBeenCalledWith(
      expect.objectContaining({
        data: dataWithComparison.comparisonLine,
        gridColumnsLength: dataWithComparison.columns.length,
        gridConfig: { paddingLeft: 0, paddingRight: 0 },
        borderConfig: { marginLeft: 56, marginRight: 16 },
      }),
      expect.anything(),
    );
  });

  it('passes extra props through to StackedArea', () => {
    render(<StackedAreaBody data={baseData} size="large" height={400} />);

    expect(StackedArea).toHaveBeenCalledWith(
      expect.objectContaining({
        data: baseData,
        size: 'large',
        height: 400,
      }),
      expect.anything(),
    );
  });

  it('uses fallback color #000 when color index is out of bounds', () => {
    const dataWithMoreLegends: StackedAreaData = {
      ...baseData,
      legends: ['Beer', 'Wine', 'Spirit'],
    };

    render(<StackedAreaBody data={dataWithMoreLegends} />);

    expect(Legend).toHaveBeenCalledWith(
      expect.objectContaining({
        caption: [
          { label: 'Beer', color: '#EFD328', pointStyle: 'roundedRectangle' },
          { label: 'Wine', color: '#D9AA4A', pointStyle: 'roundedRectangle' },
          { label: 'Spirit', color: '#000', pointStyle: 'roundedRectangle' },
        ],
      }),
      expect.anything(),
    );
  });
});
