import React from 'react';

import { render, screen } from '@testing-library/react';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id }: { id: string }) => id),
  }),
}));

jest.mock('./components', () => ({
  TotalInnovationPerformance: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'total-innovation-performance'} />
  ),
}));

jest.mock('hooks', () => ({
  useMediaQuery: () => false,
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
    dataTestId,
    fullWidth,
  }: {
    children: React.ReactNode;
    header: { title: string };
    dataTestId?: string;
    fullWidth?: boolean;
  }) => (
    <div
      data-testid={dataTestId ?? 'basic-container'}
      data-header-title={header.title}
      data-full-width={fullWidth ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
}));

import { INNOVATION_HUB_OVERVIEW_GLOBAL_TOTAL_PERFORMANCE_TITLE_I18N_ID } from './constants';
import { Overview } from './Overview';

describe('InnovationHub Overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render BasicContainer with fullWidth for tab content column', () => {
    render(<Overview />);

    expect(
      screen.getByTestId('innovation-hub-overview-container'),
    ).toHaveAttribute('data-full-width', 'true');
  });

  it('should render BasicContainer with section title from intl', () => {
    render(<Overview />);

    const container = screen.getByTestId('innovation-hub-overview-container');
    expect(container).toHaveAttribute(
      'data-header-title',
      INNOVATION_HUB_OVERVIEW_GLOBAL_TOTAL_PERFORMANCE_TITLE_I18N_ID,
    );
  });

  it('should render TotalInnovationPerformance with default data-testid', () => {
    render(<Overview />);

    expect(
      screen.getByTestId(
        'innovation-hub-overview-total-innovation-performance',
      ),
    ).toBeInTheDocument();
  });

  it('should prefix dataTestId for container and performance section when prop is set', () => {
    render(<Overview dataTestId="tabpanel-innovation-hub-overview" />);

    expect(
      screen.getByTestId('tabpanel-innovation-hub-overview-container'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        'tabpanel-innovation-hub-overview-total-innovation-performance',
      ),
    ).toBeInTheDocument();
  });
});
