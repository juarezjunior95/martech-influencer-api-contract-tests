import React from 'react';

import { render, screen } from '@testing-library/react';
import { Legend } from 'components';
import { MediaKpisCards } from 'pages/components/ConnectionsCreativity';

import { ResourceAllocationOverview } from '../../types';
import { getChartLegends } from '../../utils';
import { getChartLegend } from '../../utils/ChartsView.utils';
import { ChartsView } from './ChartsView';

jest.mock('components', () => ({
  Legend: jest.fn((props: any) => (
    <div data-testid={props.dataTestId ?? 'legend'} />
  )),
}));

jest.mock('pages/components/ConnectionsCreativity', () => ({
  MediaKpisCards: jest.fn((props: any) => (
    <div data-testid={props.dataTestId ?? 'kpis-cards'} />
  )),
}));

jest.mock('../../utils', () => ({
  getChartLegends: jest.fn(),
}));

jest.mock('../../utils/ChartsView.utils', () => ({
  getChartLegend: jest.fn(),
}));

describe('ChartsView', () => {
  const data = { someKey: {} } as unknown as ResourceAllocationOverview;
  const formatMessage = jest.fn();

  const mockLegends = [{ id: 'legend-1' }, { id: 'legend-2' }];
  const mappedLegends = [
    { label: 'label-legend-1', color: 'color-legend-1' },
    { label: 'label-legend-2', color: 'color-legend-2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getChartLegends as jest.Mock).mockReturnValue(mockLegends);
    (getChartLegend as jest.Mock).mockImplementation(
      (legend) =>
        ({
          label: `label-${legend.id}`,
          color: `color-${legend.id}`,
        }) as { label: string; color: string },
    );
  });

  it('renders KPI cards and legend with mapped captions and correct mock calls', () => {
    render(<ChartsView data={data} formatMessage={formatMessage} />);

    expect(getChartLegends).toHaveBeenCalledWith(data);
    expect(getChartLegend).toHaveBeenCalledTimes(mockLegends.length);
    mockLegends.forEach((legend, index) => {
      expect(getChartLegend).toHaveBeenNthCalledWith(index + 1, legend);
    });

    expect(MediaKpisCards).toHaveBeenCalledWith(
      { data, formatMessage, dataTestId: undefined },
      {},
    );

    expect(Legend).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: undefined,
        legendPosition: 'left',
        caption: mappedLegends,
      }),
      {},
    );

    screen.getByTestId('kpis-cards');
    screen.getByTestId('legend');
    expect(screen.queryByTestId('test-container')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('test-legend-container'),
    ).not.toBeInTheDocument();
  });

  it('renders custom dataTestId for all components', () => {
    render(
      <ChartsView
        data={data}
        formatMessage={formatMessage}
        dataTestId="test"
      />,
    );

    screen.getByTestId('test-container');
    screen.getByTestId('test-legend-container');
    screen.getByTestId('test-kpis');
    screen.getByTestId('test-legend');

    expect(MediaKpisCards).toHaveBeenCalledWith(
      { data, formatMessage, dataTestId: 'test-kpis' },
      {},
    );

    expect(Legend).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: 'test-legend',
        legendPosition: 'left',
        caption: mappedLegends,
      }),
      {},
    );
  });
});
