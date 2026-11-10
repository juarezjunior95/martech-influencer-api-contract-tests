import { render, screen } from '@testing-library/react';

import { PcYearQuarter } from './PcYearQuarter';

jest.mock('components', () => ({
  SubFilter: {
    Select: ({ apiKey, stateKey }: { apiKey: string; stateKey: string }) => (
      <div
        data-testid="subfilter-select"
        data-api-key={apiKey}
        data-state-key={stateKey}
      />
    ),
  },
}));

describe('PcYearQuarter', () => {
  it('renders the year SubFilter when "year" is selected', () => {
    render(<PcYearQuarter yearQuarterSelected="year" />);

    const select = screen.getByTestId('subfilter-select');
    expect(select).toHaveAttribute('data-api-key', 'pc-time-frame-years');
    expect(select).toHaveAttribute('data-state-key', 'pc_time_frame_years');
  });

  it.each(['quarter', '', 'unknown'])(
    'renders the quarter SubFilter for any non-year value (%s)',
    (value) => {
      render(<PcYearQuarter yearQuarterSelected={value} />);

      const select = screen.getByTestId('subfilter-select');
      expect(select).toHaveAttribute('data-api-key', 'pc-time-frame-quarters');
      expect(select).toHaveAttribute(
        'data-state-key',
        'pc_time_frame_quarters',
      );
    },
  );

  it('overrides stateKeys when custom values are provided', () => {
    const { rerender } = render(
      <PcYearQuarter
        yearQuarterSelected="year"
        stateKeys={{ year: 'custom_year', quarter: 'custom_quarter' }}
      />,
    );
    expect(screen.getByTestId('subfilter-select')).toHaveAttribute(
      'data-state-key',
      'custom_year',
    );

    rerender(
      <PcYearQuarter
        yearQuarterSelected="quarter"
        stateKeys={{ year: 'custom_year', quarter: 'custom_quarter' }}
      />,
    );
    expect(screen.getByTestId('subfilter-select')).toHaveAttribute(
      'data-state-key',
      'custom_quarter',
    );
  });
});
