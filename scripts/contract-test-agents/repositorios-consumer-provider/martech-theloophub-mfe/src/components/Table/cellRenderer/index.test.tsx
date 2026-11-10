import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GroupCellRendererParams } from 'ag-grid-community';

import { cellRenderer } from './index';

// Mock all the renderer components
jest.mock('../components', () => ({
  ImgRenderer: ({ dataTestId }: any) => (
    <div data-testid="img-renderer" data-datatestid={dataTestId}>
      ImgRenderer
    </div>
  ),
}));

jest.mock('./components', () => ({
  BrandsRenderer: () => <div data-testid="brands-renderer">BrandsRenderer</div>,
  ChartRenderer: () => <div data-testid="chart-renderer">ChartRenderer</div>,
  GanttChartRenderer: () => (
    <div data-testid="gantt-renderer">GanttChartRenderer</div>
  ),
  TagRenderer: () => <div data-testid="tag-renderer">TagRenderer</div>,
  TooltipRenderer: ({ value }: any) => (
    <div data-testid="tooltip-renderer">{value}</div>
  ),
  UnitMeasureRenderer: ({ value }: any) => (
    <div data-testid="unit-measure-renderer">{value}</div>
  ),
}));

jest.mock('./components/ChartLegendRenderer', () => ({
  ChartLengendRenderer: () => (
    <div data-testid="chart-legend-renderer">ChartLengendRenderer</div>
  ),
}));

jest.mock('./components/SubtitleRenderer', () => ({
  SubtitleRenderer: ({ value }: any) => (
    <div data-testid="subtitle-renderer">{value}</div>
  ),
}));

jest.mock('utils/regex', () => ({
  isImage: {
    test: (str: string) => /\.(jpg|jpeg|png|gif|svg)$/i.test(str),
  },
  isNumber: {
    test: (value: any) => !isNaN(value) && typeof value === 'number',
  },
}));

jest.mock('utils/format', () => ({
  formatNumber: (num: number) => num.toLocaleString(),
}));

describe('cellRenderer', () => {
  const createMockParams = (
    overrides: Partial<GroupCellRendererParams> = {},
  ): GroupCellRendererParams => {
    return {
      value: 'test value',
      colDef: { field: 'testField' },
      data: {},
      column: {
        getColId: () => 'testField',
      } as any,
      api: {} as any,
      node: {} as any,
      context: {},
      ...overrides,
    } as GroupCellRendererParams;
  };

  it('should render with data-testid from config when provided', () => {
    const params = createMockParams({
      data: {
        testField_config: {
          dataTestId: 'custom-test-id',
        },
      },
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const cellContent = container.querySelector(
      '[data-testid="cell-custom-test-id"]',
    );
    expect(cellContent).toBeInTheDocument();
  });

  it('should render with default data-testid when config.dataTestId is not provided', () => {
    const params = createMockParams({
      colDef: { field: 'volumeField' },
      column: {
        getColId: () => 'volume-2024',
      } as any,
      data: {},
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const cellContent = container.querySelector(
      '[data-testid="cell-volumefield-volume-2024"]',
    );
    expect(cellContent).toBeInTheDocument();
  });

  it('should sanitize field and colId for data-testid', () => {
    const params = createMockParams({
      colDef: { field: "Volume (HL) '24" },
      column: {
        getColId: () => "vol'24-test",
      } as any,
      data: {},
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const cellContent = container.querySelector(
      '[data-testid="cell-volume-hl-24-vol-24-test"]',
    );
    expect(cellContent).toBeInTheDocument();
  });

  it('should use field as fallback when colId is not available', () => {
    const params = createMockParams({
      colDef: { field: 'portfolio' },
      column: {
        getColId: () => null as any,
      } as any,
      data: {},
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const cellContent = container.querySelector(
      '[data-testid="cell-portfolio"]',
    );
    expect(cellContent).toBeInTheDocument();
  });

  it('should pass dataTestId to ImgRenderer when rendering image', () => {
    const params = createMockParams({
      value: 'brand-logo.png',
      colDef: { field: 'brandField' },
      column: {
        getColId: () => 'brand-col',
      } as any,
      data: {
        brandField_config: {
          imgName: 'Brand Logo',
        },
      },
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const imgRenderer = container.querySelector('[data-testid="img-renderer"]');
    expect(imgRenderer).toBeInTheDocument();
    expect(imgRenderer).toHaveAttribute(
      'data-datatestid',
      'brandfield-brand-col',
    );
  });

  it('should pass config.dataTestId to ImgRenderer when available', () => {
    const params = createMockParams({
      value: 'brand-logo.png',
      colDef: { field: 'brandField' },
      data: {
        brandField_config: {
          imgName: 'Brand Logo',
          dataTestId: 'custom-brand-id',
        },
      },
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const imgRenderer = container.querySelector('[data-testid="img-renderer"]');
    expect(imgRenderer).toBeInTheDocument();
    expect(imgRenderer).toHaveAttribute('data-datatestid', 'custom-brand-id');
  });

  it('should render simple text value with data-testid', () => {
    const params = createMockParams({
      value: 'Simple Text',
      colDef: { field: 'textField' },
      column: {
        getColId: () => 'textField',
      } as any,
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    const cellContent = container.querySelector(
      '[data-testid="cell-textfield-textfield"]',
    );
    expect(cellContent).toBeInTheDocument();
    expect(cellContent).toHaveTextContent('Simple Text');
  });

  it('should handle field with undefined gracefully', () => {
    const params = createMockParams({
      colDef: { field: undefined },
      column: {
        getColId: () => 'some-col',
      } as any,
    });

    const result = cellRenderer(params);
    const { container } = render(<>{result}</>);

    // Should fallback to 'unknown' for field
    const cellContent = container.querySelector(
      '[data-testid="cell-unknown-some-col"]',
    );
    expect(cellContent).toBeInTheDocument();
  });
});
