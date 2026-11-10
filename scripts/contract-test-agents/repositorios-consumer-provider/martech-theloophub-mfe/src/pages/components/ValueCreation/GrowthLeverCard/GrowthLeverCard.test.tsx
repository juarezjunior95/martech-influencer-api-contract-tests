import React from 'react';

import { render, screen } from '@testing-library/react';

import { GrowthLeverCard } from './GrowthLeverCard';
import type { GrowthLeverCardData } from './types';

jest.mock('components', () => ({
  BigNumber: ({ data }: { data: unknown[] }) => (
    <div data-testid="big-number">
      <span data-testid="big-number-count">{data.length}</span>
    </div>
  ),
  ChartHeader: ({ title, info }: { title: string; info?: string }) => (
    <div data-testid="chart-header">
      <span>{title}</span>
      {info && <span data-testid="tooltip">{info}</span>}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledParagraph: ({
    children,
    size,
  }: {
    children: React.ReactNode;
    size?: string;
  }) => (
    <p data-testid="styled-paragraph" data-size={size}>
      {children}
    </p>
  ),
}));

jest.mock('./GrowthLeverCard.styles', () => ({
  StyledGrowthLeverCard: ({
    children,
    active,
  }: {
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <div data-testid="growth-lever-card" data-active={String(active)}>
      {children}
    </div>
  ),
  StyledNoticeMessageContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="notice-message-container">{children}</div>,
  StyledNoDataYetIcon: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img data-testid="no-data-yet-icon" alt="" {...props} />
  ),
  StyledGrowthLeverCardImage: (
    props: React.ImgHTMLAttributes<HTMLImageElement>,
  ) => <img data-testid="growth-lever-card-image" alt="" {...props} />,
  StyledGrowthLeverCardHeader: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="growth-lever-header">{children}</div>,
  StyledGrowthLeverCardContent: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="growth-lever-content">{children}</div>,
  StyledGrowthLeverCardRow: ({
    children,
    hasBorderBottom,
  }: {
    children: React.ReactNode;
    hasBorderBottom?: boolean;
  }) => (
    <div
      data-testid="growth-lever-row"
      data-has-border-bottom={String(hasBorderBottom)}
    >
      {children}
    </div>
  ),
}));

const mockData: GrowthLeverCardData = {
  title: 'Superior Core',
  rows: [
    {
      label: 'Vol. Weight',
      bigNumberData: [{ bigNumber: { value: '1.1', measure: '%' } }],
    },
    {
      label: 'Vol. vs LY',
      bigNumberData: [{ bigNumber: { value: '0.5', measure: '%' } }],
    },
  ],
};

const mockImage = 'https://example.com/superior-core.png';

describe('GrowthLeverCard', () => {
  describe('Basic Rendering', () => {
    it('should render image, title and rows', () => {
      render(<GrowthLeverCard image={mockImage} data={mockData} />);

      expect(screen.getByTestId('growth-lever-card')).toBeInTheDocument();
      const img = screen.getByRole('img', { name: 'Superior Core' });
      expect(img).toHaveAttribute('src', mockImage);
      expect(screen.getByTestId('chart-header')).toHaveTextContent(
        'Superior Core',
      );
      expect(screen.getAllByTestId('growth-lever-row')).toHaveLength(2);
      expect(screen.getByText('Vol. Weight')).toBeInTheDocument();
      expect(screen.getByText('Vol. vs LY')).toBeInTheDocument();
    });

    it('should render tooltip when provided', () => {
      render(
        <GrowthLeverCard
          image={mockImage}
          data={mockData}
          tooltip="Superior Core tooltip"
        />,
      );

      expect(screen.getByTestId('tooltip')).toHaveTextContent(
        'Superior Core tooltip',
      );
    });

    it('should pass active prop to card', () => {
      render(
        <GrowthLeverCard image={mockImage} data={mockData} active={true} />,
      );

      expect(screen.getByTestId('growth-lever-card')).toHaveAttribute(
        'data-active',
        'true',
      );
    });
  });

  describe('Rows', () => {
    it('should render BigNumber for each row', () => {
      render(<GrowthLeverCard image={mockImage} data={mockData} />);

      expect(screen.getAllByTestId('big-number')).toHaveLength(2);
    });
  });
});
