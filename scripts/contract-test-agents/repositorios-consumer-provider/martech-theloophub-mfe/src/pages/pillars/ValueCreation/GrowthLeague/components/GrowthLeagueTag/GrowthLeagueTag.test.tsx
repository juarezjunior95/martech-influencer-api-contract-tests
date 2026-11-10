import { render, screen } from '@testing-library/react';

import { GrowthLeagueTag } from './GrowthLeagueTag';

jest.mock('utils/format', () => ({
  formatNumber: (value: number) => value.toFixed(1),
}));

describe('GrowthLeagueTag', () => {
  describe('color variants based on value', () => {
    it.each([
      [85, 'rgba(230, 249, 230, 1)', 'green'],
      [80, 'rgba(230, 249, 230, 1)', 'green (boundary 80)'],
      [100, 'rgba(230, 249, 230, 1)', 'green (100)'],
      [999, 'rgba(230, 249, 230, 1)', 'green (very large)'],
      [70, 'rgba(255, 249, 230, 1)', 'orange'],
      [60, 'rgba(255, 249, 230, 1)', 'orange (boundary 60)'],
      [79.99, 'rgba(255, 249, 230, 1)', 'orange (boundary 79.99)'],
      [50, 'rgba(255, 230, 230, 1)', 'red'],
      [59, 'rgba(255, 230, 230, 1)', 'red (boundary 59)'],
      [59.99, 'rgba(255, 230, 230, 1)', 'red (boundary 59.99)'],
      [0, 'rgba(255, 230, 230, 1)', 'red (0)'],
      [-10, 'rgba(255, 230, 230, 1)', 'red (negative)'],
    ])('renders value %d with background %s (%s)', (value, expectedBg) => {
      render(<GrowthLeagueTag value={value} dataTestId="test" />);
      expect(screen.getByTestId('test-growth-league')).toHaveStyle(
        `background-color: ${expectedBg}`,
      );
    });

    it('renders grey variant when value is "-"', () => {
      render(<GrowthLeagueTag value="-" dataTestId="test" />);
      expect(screen.getByTestId('test-growth-league')).toHaveStyle(
        'background-color: rgba(242, 242, 242, 1)',
      );
    });
  });

  describe('string value handling', () => {
    it.each([
      ['85', 'rgba(230, 249, 230, 1)', 'green'],
      ['65', 'rgba(255, 249, 230, 1)', 'orange'],
      ['45', 'rgba(255, 230, 230, 1)', 'red'],
      ['79.9', 'rgba(255, 249, 230, 1)', 'orange (decimal)'],
    ])('parses "%s" and applies %s background', (value, expectedBg) => {
      render(<GrowthLeagueTag value={value} dataTestId="test" />);
      expect(screen.getByTestId('test-growth-league')).toHaveStyle(
        `background-color: ${expectedBg}`,
      );
    });
  });

  describe('value formatting and unit measure', () => {
    it('formats numeric values with one decimal place and displays without unit by default', () => {
      render(<GrowthLeagueTag value={85} />);
      expect(screen.getByText('85.0')).toBeInTheDocument();
    });

    it('formats decimal values correctly', () => {
      render(<GrowthLeagueTag value={72.5} />);
      expect(screen.getByText('72.5')).toBeInTheDocument();
    });

    it('appends unitMeasure when provided', () => {
      render(<GrowthLeagueTag value={85} unitMeasure="%" />);
      expect(screen.getByText('85.0%')).toBeInTheDocument();
    });

    it('appends custom unit measure', () => {
      render(<GrowthLeagueTag value={42} unitMeasure="pts" />);
      expect(screen.getByText('42.0pts')).toBeInTheDocument();
    });

    it('displays raw "-" without formatting when value is "-"', () => {
      render(<GrowthLeagueTag value="-" />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('treats empty string unitMeasure as no unit', () => {
      render(<GrowthLeagueTag value={85} unitMeasure="" />);
      expect(screen.getByText('85.0')).toBeInTheDocument();
    });
  });

  describe('data-testid rendering', () => {
    it('passes dataTestId as prefixed testid to the Tag', () => {
      render(<GrowthLeagueTag value={85} dataTestId="custom" />);
      expect(screen.getByTestId('custom-growth-league')).toBeInTheDocument();
    });

    it('renders without custom-prefixed testid when dataTestId is not provided', () => {
      const { container } = render(<GrowthLeagueTag value={85} />);
      expect(
        container.querySelectorAll('[data-testid^="custom-"]'),
      ).toHaveLength(0);
    });
  });
});
