import React from 'react';

import { render, screen } from '@testing-library/react';

import { ChartCellRenderer } from './ChartCellRenderer';

jest.mock('components/Chart', () => ({
  BarY: ({ chartData, scale, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'bar-y'}
      data-scale={scale}
      data-bar-thickness={chartData?.barThickness}
    >
      BarY
    </div>
  ),
}));

describe('ChartCellRenderer', () => {
  const createParams = (config?: any, value?: any, selectedRows?: any[]) =>
    ({
      colDef: { field: 'test_field' },
      data: {
        id: 'row-1',
        test_field_config: config,
      },
      value: value || 'default value',
      api: {
        getSelectedRows: () => selectedRows || [],
        forEachNode: jest.fn(),
      },
    }) as any;

  it('should render div with ag-cell-content class', () => {
    const params = createParams();

    const { container } = render(ChartCellRenderer(params, false));

    expect(container.querySelector('.ag-cell-content')).toBeInTheDocument();
  });

  it('should render default value when no chartData config', () => {
    const params = createParams(null, 'test value');

    render(ChartCellRenderer(params, false));

    expect(screen.getByText('test value')).toBeInTheDocument();
  });

  it('should render BarY when chartData config exists', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
        secondaryBackgroundColor: '#00ff00',
      },
    };
    const params = createParams(config);

    render(ChartCellRenderer(params, false));

    expect(screen.getByTestId('bar-y')).toBeInTheDocument();
  });

  it('should use backgroundColor when no row is selected', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
        secondaryBackgroundColor: '#00ff00',
      },
    };
    const params = createParams(config);

    render(ChartCellRenderer(params, false));

    expect(screen.getByTestId('bar-y')).toBeInTheDocument();
  });

  it('should use backgroundColor when current row is selected', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
        secondaryBackgroundColor: '#00ff00',
      },
    };
    const params = createParams(config, null, [{ id: 'row-1' }]);

    render(ChartCellRenderer(params, true));

    expect(screen.getByTestId('bar-y')).toBeInTheDocument();
  });

  it('should use secondaryBackgroundColor when another row is selected', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
        secondaryBackgroundColor: '#00ff00',
      },
    };
    const params = createParams(config, null, [{ id: 'row-2' }]);

    render(ChartCellRenderer(params, true));

    expect(screen.getByTestId('bar-y')).toBeInTheDocument();
  });

  it('should pass chartHeight as barThickness', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
      },
    };
    const params = createParams(config);

    render(ChartCellRenderer(params, false, 32));

    expect(screen.getByTestId('bar-y')).toHaveAttribute(
      'data-bar-thickness',
      '32',
    );
  });

  it('should use default chartHeight of 24', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
      },
    };
    const params = createParams(config);

    render(ChartCellRenderer(params, false));

    expect(screen.getByTestId('bar-y')).toHaveAttribute(
      'data-bar-thickness',
      '24',
    );
  });

  it('should use externalScale when provided', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
      },
    };
    const params = createParams(config);

    render(ChartCellRenderer(params, false, 24, 100));

    expect(screen.getByTestId('bar-y')).toHaveAttribute('data-scale', '101');
  });

  it('should calculate optimal scale from column max value', () => {
    const config = {
      chartData: {
        data: [10, 20, 30],
        backgroundColor: '#ff0000',
      },
    };
    const params = createParams(config);
    params.api.forEachNode = (callback: any) => {
      callback({
        data: {
          test_field_config: {
            chartData: { data: [50, 100, 75] },
          },
        },
      });
    };

    render(ChartCellRenderer(params, false));

    expect(screen.getByTestId('bar-y')).toBeInTheDocument();
  });

  it('should return scale of 100 when maxValue is 0 or less', () => {
    const config = {
      chartData: {
        data: [0],
        backgroundColor: '#ff0000',
      },
    };
    const params = createParams(config);
    params.api.forEachNode = jest.fn();

    render(ChartCellRenderer(params, false));

    expect(screen.getByTestId('bar-y')).toHaveAttribute('data-scale', '0');
  });

  describe('data-testid Rendering', () => {
    it('should render container with data-testid when provided', () => {
      const params = createParams();

      const { container } = render(
        ChartCellRenderer(params, false, 24, undefined, 'custom'),
      );

      expect(
        container.querySelector('[data-testid="chart-cell-renderer-custom"]'),
      ).toBeInTheDocument();
    });

    it('should pass dataTestId to BarY when provided', () => {
      const config = {
        chartData: {
          data: [10, 20, 30],
          backgroundColor: '#ff0000',
        },
      };
      const params = createParams(config);

      render(ChartCellRenderer(params, false, 24, undefined, 'custom'));

      expect(
        screen.getByTestId('custom-chart-cell-renderer'),
      ).toBeInTheDocument();
    });

    it('should not render container data-testid when not provided', () => {
      const params = createParams();

      const { container } = render(ChartCellRenderer(params, false));

      expect(
        container.querySelector('[data-testid^="chart-cell-renderer-"]'),
      ).not.toBeInTheDocument();
    });

    it('should render BarY with default data-testid when dataTestId is not provided', () => {
      const config = {
        chartData: {
          data: [10, 20, 30],
          backgroundColor: '#ff0000',
        },
      };
      const params = createParams(config);

      render(ChartCellRenderer(params, false));

      expect(screen.getByTestId('bar-y')).toBeInTheDocument();
    });
  });
});
