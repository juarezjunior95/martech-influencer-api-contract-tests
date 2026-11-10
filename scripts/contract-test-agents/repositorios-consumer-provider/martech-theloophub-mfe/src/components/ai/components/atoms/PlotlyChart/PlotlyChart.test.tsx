import { render, screen, waitFor } from '@testing-library/react';

const mockNewPlot = jest.fn();
const mockPurge = jest.fn();

jest.mock('plotly.js-dist-min', () => ({
  __esModule: true,
  default: {
    newPlot: (...args: unknown[]) => mockNewPlot(...args),
    purge: (...args: unknown[]) => mockPurge(...args),
  },
}));

import { PlotlyChart } from './PlotlyChart';

const validFigure = JSON.stringify({
  data: [{ x: [1, 2], y: [3, 4], type: 'bar' }],
  layout: { title: { text: 'My Chart' } },
});

describe('PlotlyChart', () => {
  beforeEach(() => {
    mockNewPlot.mockResolvedValue(undefined);
    mockPurge.mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls Plotly.newPlot with parsed data', async () => {
    render(<PlotlyChart figureJson={validFigure} />);
    await waitFor(() => {
      expect(mockNewPlot).toHaveBeenCalledTimes(1);
    });
  });

  it('extracts and renders chart title', async () => {
    render(<PlotlyChart figureJson={validFigure} />);
    await waitFor(() => {
      expect(screen.getByText('My Chart')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid JSON', async () => {
    render(<PlotlyChart figureJson="not json" />);
    await waitFor(() => {
      expect(screen.getByText('Unable to render chart.')).toBeInTheDocument();
    });
  });

  it('handles string title format', async () => {
    const figure = JSON.stringify({
      data: [],
      layout: { title: 'String Title' },
    });
    render(<PlotlyChart figureJson={figure} />);
    await waitFor(() => {
      expect(screen.getByText('String Title')).toBeInTheDocument();
    });
  });
});
