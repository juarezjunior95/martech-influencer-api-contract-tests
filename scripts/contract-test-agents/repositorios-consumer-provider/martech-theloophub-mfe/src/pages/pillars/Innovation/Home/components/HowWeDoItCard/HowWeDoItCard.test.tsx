import React from 'react';

import { render, screen } from '@testing-library/react';

import { HOW_WE_DO_IT_BIG_NUMBERS_BFF_REF } from '../../__mocks/innovationHomeBffData';
import { HowWeDoItCard } from './HowWeDoItCard';
import type { HowWeDoItSection } from './types';

const mockMessages: Record<string, string> = {
  'card.title': 'Portfolio Health',
  'card.description': 'Assess portfolio of brands and SKUs',
};

jest.mock('hooks', () => ({
  useMediaQuery: () => false,
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => mockMessages[id] ?? id,
  }),
}));

jest.mock('components', () => ({
  BigNumber: ({
    header,
    data,
  }: {
    header?: React.ReactNode;
    data: unknown[];
  }) => (
    <div data-testid="big-number" data-length={data.length}>
      {header}
      <span data-testid="big-number-data">{JSON.stringify(data.length)}</span>
    </div>
  ),
  ChartHeader: ({
    title,
    period,
    measure,
    dataTestId,
  }: {
    title: string;
    period: string;
    measure?: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'chart-header'}
      data-title={title}
      data-period={period}
      data-measure={measure ?? ''}
    >
      {title} – {period}
    </div>
  ),
  DataStateHandler: ({
    children,
    loading,
    error,
    empty,
  }: {
    children: React.ReactNode;
    loading: boolean;
    error: Error | null;
    empty: boolean;
  }) => (
    <div
      data-testid="data-state-handler"
      data-loading={loading}
      data-empty={empty}
      data-error={!!error}
    >
      {children}
    </div>
  ),
  SubPillarCard: ({
    children,
    title,
    description,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div
      data-testid="sub-pillar-card"
      data-title={title}
      data-description={description}
    >
      {children}
    </div>
  ),
}));

const defaultProps = {
  titleId: 'card.title',
  descriptionId: 'card.description',
  section: null as HowWeDoItSection | null,
  loading: false,
  error: null as Error | null,
};

const sectionWithData: HowWeDoItSection = {
  title: 'Section Title',
  period: 'YTD 2024',
  measure: '%',
  bigNumberData: [
    {
      bigNumber: { value: '10%', measure: '%' },
      comparison: { label: 'vs LY', value: '+2%' },
    },
  ],
};

describe('HowWeDoItCard', () => {
  describe('Basic Rendering', () => {
    it('should render SubPillarCard with title and description from i18n', () => {
      render(<HowWeDoItCard {...defaultProps} />);

      const card = screen.getByTestId('sub-pillar-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-title', 'Portfolio Health');
      expect(card).toHaveAttribute(
        'data-description',
        'Assess portfolio of brands and SKUs',
      );
    });

    it('should render DataStateHandler and BigNumber', () => {
      render(<HowWeDoItCard {...defaultProps} />);

      expect(screen.getByTestId('data-state-handler')).toBeInTheDocument();
      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });
  });

  describe('With section data', () => {
    it('should render ChartHeader when section is provided', () => {
      render(<HowWeDoItCard {...defaultProps} section={sectionWithData} />);

      const chartHeader = screen.getByTestId('chart-header');
      expect(chartHeader).toBeInTheDocument();
      expect(chartHeader).toHaveAttribute('data-title', 'Section Title');
      expect(chartHeader).toHaveAttribute('data-period', 'YTD 2024');
    });

    it('should pass bigNumberData to BigNumber', () => {
      render(<HowWeDoItCard {...defaultProps} section={sectionWithData} />);

      const bigNumberData = screen.getByTestId('big-number-data');
      expect(bigNumberData).toHaveTextContent('1');
    });
  });

  describe('Without section (empty)', () => {
    it('should not render ChartHeader when section is null', () => {
      render(<HowWeDoItCard {...defaultProps} />);

      expect(screen.queryByTestId('chart-header')).not.toBeInTheDocument();
    });

    it('should pass empty array to BigNumber when section is null', () => {
      render(<HowWeDoItCard {...defaultProps} />);

      const bigNumberData = screen.getByTestId('big-number-data');
      expect(bigNumberData).toHaveTextContent('0');
    });

    it('should set DataStateHandler empty when section is null', () => {
      render(<HowWeDoItCard {...defaultProps} />);

      expect(screen.getByTestId('data-state-handler')).toHaveAttribute(
        'data-empty',
        'true',
      );
    });
  });

  describe('Loading and error states', () => {
    it('should pass loading to DataStateHandler', () => {
      render(<HowWeDoItCard {...defaultProps} loading />);

      expect(screen.getByTestId('data-state-handler')).toHaveAttribute(
        'data-loading',
        'true',
      );
    });

    it('should pass error to DataStateHandler', () => {
      const err = new Error('Request failed');
      render(<HowWeDoItCard {...defaultProps} error={err} />);

      expect(screen.getByTestId('data-state-handler')).toHaveAttribute(
        'data-error',
        'true',
      );
    });
  });

  describe('Custom minHeight', () => {
    it('should accept optional minHeight prop', () => {
      render(<HowWeDoItCard {...defaultProps} minHeight="180px" />);

      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });
  });

  describe('Chart header measure and optional dataTestId', () => {
    it('forwards dataTestId to chart header and root', () => {
      render(
        <HowWeDoItCard
          {...defaultProps}
          section={sectionWithData}
          dataTestId="how-we-do-it-instance"
        />,
      );

      expect(screen.getByTestId('new-how-we-do-it-card')).toBeInTheDocument();
      expect(screen.getByTestId('new-how-we-do-it-card')).toHaveAttribute(
        'data-instance-testid',
        'how-we-do-it-instance',
      );

      const chartHeader = screen.getByTestId(
        'how-we-do-it-instance-chart-header',
      );
      expect(chartHeader).toHaveAttribute('data-title', 'Section Title');
      expect(chartHeader).toHaveAttribute('data-period', 'YTD 2024');
      expect(chartHeader).toHaveAttribute('data-measure', '%');
    });

    it('omits chart header dataTestId when dataTestId prop is not set', () => {
      render(<HowWeDoItCard {...defaultProps} section={sectionWithData} />);

      expect(screen.getByTestId('new-how-we-do-it-card')).toBeInTheDocument();
      expect(
        screen.queryByTestId('undefined-chart-header'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('chart-header')).toBeInTheDocument();
    });
  });

  describe('BFF mock (concept)', () => {
    it('uses HOW_WE_DO_IT_BIG_NUMBERS_BFF_REF.packPriceBigNumber for header title, period, and measure', () => {
      const section = HOW_WE_DO_IT_BIG_NUMBERS_BFF_REF.packPriceBigNumber;

      render(
        <HowWeDoItCard
          {...defaultProps}
          section={section}
          dataTestId="how-we-do-it-pack-price-concept"
        />,
      );

      const chartHeader = screen.getByTestId(
        'how-we-do-it-pack-price-concept-chart-header',
      );
      expect(chartHeader).toHaveAttribute(
        'data-title',
        'Pack & Price Driven Volume',
      );
      expect(chartHeader).toHaveAttribute('data-period', "Apr'26");
      expect(chartHeader).toHaveAttribute('data-measure', '[ k hl ]');
      expect(screen.getByTestId('big-number-data')).toHaveTextContent('1');
    });
  });
});
