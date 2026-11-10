import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import { BarY } from 'components/Chart/Bar/BarY/BarY';

import {
  SingleBarChartWithVariationProps,
  SingleBarWithVariation,
} from './SingleBarWithVariation';

jest.mock('components/Chart/Bar/BarY/BarY', () => {
  const mockBarY = jest.fn((props) => (
    <div data-testid="single-bar-chart">Mocked SingleBar</div>
  ));
  return {
    __esModule: true,
    BarY: mockBarY,
  };
});

describe('SingleBarWithVariation Component', () => {
  const mockChartData = {
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    barThickness: 32,
    data: [50],
    label: ['singleBar'],
  };

  const mockVariation: SingleBarChartWithVariationProps['variation'] = {
    variation: 10,
    direction: 'green',
    unitOfMeasure: '%',
  };

  it('renders correctly with valid data', () => {
    render(
      <SingleBarWithVariation
        chartData={mockChartData}
        variation={mockVariation}
      />,
    );

    expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('returns null if chartData is not provided', () => {
    const { container } = render(
      <SingleBarWithVariation chartData={null} variation={mockVariation} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null if variation is not provided', () => {
    const { container } = render(
      <SingleBarWithVariation chartData={mockChartData} variation={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('passes the correct props to SingleBar', () => {
    render(
      <SingleBarWithVariation
        chartData={mockChartData}
        variation={mockVariation}
      />,
    );

    expect(BarY).toHaveBeenCalledWith(
      expect.objectContaining({
        chartData: mockChartData,
      }),
      {},
    );
  });

  it('applies custom formatting when formatValueFn is provided', () => {
    const customFormat = (value: number) => `${value.toFixed(1)}`;
    render(
      <SingleBarWithVariation
        chartData={mockChartData}
        variation={mockVariation}
        formatValueFn={customFormat}
      />,
    );

    expect(screen.getByText('10.0')).toBeInTheDocument();
  });

  it('uses default formatting when formatValueFn is not provided', () => {
    render(
      <SingleBarWithVariation
        chartData={mockChartData}
        variation={mockVariation}
      />,
    );

    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
