import React from 'react';
import { IntlProvider } from 'react-intl';

import { fireEvent, render, screen } from '@testing-library/react';

import { IncreaseBrandPower } from './IncreaseBrandPower';

const mockNavigate = jest.fn();
const mockUseFeatureToggle = jest.fn();

const messages = {
  'PortfolioBrand.Home.containerTitleIncreaseBrandPower':
    'Increase Brand Power',
};

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={messages} onError={() => undefined}>
      {ui}
    </IntlProvider>,
  );

const defaultProps = {
  loading: false,
  error: null as Error | null,
  data: {
    title: 'ABI Brand Power',
    period: 'R12M',
    bigNumberData: [],
  },
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('hooks', () => ({
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
  useMediaQuery: () => false,
}));

jest.mock('../../PortfolioBrandHome', () => ({
  PORTFOLIO_BRAND_HOME_PAGE_NAME: 'portfolio-brand_home',
}));

jest.mock('pages/components', () => ({
  BigNumberSparkLineCard: ({
    containerTitle,
    onClick,
    data,
    children,
  }: {
    containerTitle: string;
    onClick: () => void;
    data: { chartTitle?: string };
    children?: React.ReactNode;
  }) => (
    <button
      data-testid="big-number-sparkline-card"
      data-title={containerTitle}
      data-chart-title={data?.chartTitle}
      onClick={onClick}
    >
      BigNumberSparkLineCard
      {children}
    </button>
  ),
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({
    dataTestId,
    summaryPageIdentifier,
  }: {
    dataTestId: string;
    summaryPageIdentifier: string;
  }) => (
    <div data-testid={dataTestId} data-identifier={summaryPageIdentifier}>
      AISummary
    </div>
  ),
}));

describe('IncreaseBrandPower', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeatureToggle.mockReturnValue([true, false]);
  });

  it('renders the BigNumberSparkLineCard with the formatted container title and chart title from data', () => {
    renderWithIntl(<IncreaseBrandPower {...defaultProps} />);

    const card = screen.getByTestId('big-number-sparkline-card');
    expect(card).toHaveAttribute('data-title', 'Increase Brand Power');
    expect(card).toHaveAttribute('data-chart-title', 'ABI Brand Power');
  });

  it('navigates to the brand power book page when the card is clicked', () => {
    renderWithIntl(<IncreaseBrandPower {...defaultProps} />);

    fireEvent.click(screen.getByTestId('big-number-sparkline-card'));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/portfolio-brand/brand-power-book/power-book',
    );
  });

  describe('AI Summary feature toggle', () => {
    it('renders the AI Summary with the brand power book overview identifier when the toggle is enabled', () => {
      renderWithIntl(<IncreaseBrandPower {...defaultProps} />);

      const aiSummary = screen.getByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummary).toHaveAttribute(
        'data-identifier',
        '3. Portfolio and brand; Brand Power Book; Overview',
      );
    });

    it.each([
      ['disabled', [false, false]],
      ['still loading', [true, true]],
    ])(
      'does NOT render the AI Summary when the toggle is %s',
      (_label, toggleReturn) => {
        mockUseFeatureToggle.mockReturnValue(toggleReturn);

        renderWithIntl(<IncreaseBrandPower {...defaultProps} />);

        expect(
          screen.queryByTestId('ai-summary-big-number-spark-line-card'),
        ).not.toBeInTheDocument();
      },
    );
  });
});
