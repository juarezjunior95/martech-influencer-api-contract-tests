import { render } from '@testing-library/react';

jest.mock('plotly.js-dist-min', () => ({
  __esModule: true,
  default: {
    newPlot: jest.fn().mockResolvedValue(undefined),
    purge: jest.fn(),
  },
}));

import { ChartSection } from './ChartSection';

const charts = [
  {
    chart_id: 'c1',
    title: 'Chart 1',
    figure_json: JSON.stringify({ data: [], layout: {} }),
    timestamp: '2025-01-01',
  },
  {
    chart_id: 'c2',
    title: 'Chart 2',
    figure_json: JSON.stringify({ data: [], layout: {} }),
    timestamp: '2025-01-02',
  },
];

describe('ChartSection', () => {
  it('renders container with data-charts attribute', () => {
    const { container } = render(<ChartSection charts={charts} />);
    expect(container.querySelector('[data-charts]')).toBeInTheDocument();
  });

  it('renders one chart per item', () => {
    const { container } = render(<ChartSection charts={charts} />);
    const chartContainer = container.querySelector('[data-charts]');
    expect(chartContainer?.children).toHaveLength(2);
  });
});
