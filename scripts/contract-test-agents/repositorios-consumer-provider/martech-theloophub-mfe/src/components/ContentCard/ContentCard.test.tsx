import { render, screen } from '@testing-library/react';

import { ContentCard } from './ContentCard';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, size }: any) => (
    <h2 data-testid="heading" data-size={size}>
      {children}
    </h2>
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ size }: any) => <span data-testid="icon" data-size={size} />,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => null,
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, content }: any) => (
    <div data-testid="custom-tooltip">
      {content}
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles/typography.styles', () => ({
  StyledTooltip: ({ children, size }: any) => (
    <span data-testid="styled-tooltip" data-size={size}>
      {children}
    </span>
  ),
}));

jest.mock('./ContentCard.styles', () => ({
  StyledMainContainer: ({ children, fullWidth, noPaddingX }: any) => (
    <div
      data-testid="content-card"
      data-full-width={String(fullWidth)}
      data-no-padding-x={String(noPaddingX)}
    >
      {children}
    </div>
  ),
  StyledContentCardHeader: ({ children }: any) => (
    <div data-testid="content-card-header">{children}</div>
  ),
}));

describe('ContentCard', () => {
  describe('Rendering', () => {
    it('should render content card', () => {
      render(
        <ContentCard title="My Card">
          <div>Content</div>
        </ContentCard>,
      );

      expect(screen.getByTestId('content-card')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(
        <ContentCard title="My Card">
          <div>Content</div>
        </ContentCard>,
      );

      expect(screen.getByTestId('heading')).toHaveTextContent('My Card');
    });

    it('should render children', () => {
      render(
        <ContentCard title="My Card">
          <div data-testid="child-content">Content</div>
        </ContentCard>,
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('should render tooltip when tooltip prop is provided', () => {
      render(
        <ContentCard title="My Card" tooltip="Tooltip text">
          <div>Content</div>
        </ContentCard>,
      );

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('styled-tooltip')).toHaveTextContent(
        'Tooltip text',
      );
    });

    it('should not render tooltip when tooltip prop is not provided', () => {
      render(
        <ContentCard title="My Card">
          <div>Content</div>
        </ContentCard>,
      );

      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should apply fullWidth when fullWidth prop is true', () => {
      render(
        <ContentCard title="My Card" fullWidth>
          <div>Content</div>
        </ContentCard>,
      );

      expect(screen.getByTestId('content-card')).toHaveAttribute(
        'data-full-width',
        'true',
      );
    });

    it('should apply noPaddingX when noPaddingX prop is true', () => {
      render(
        <ContentCard title="My Card" noPaddingX>
          <div>Content</div>
        </ContentCard>,
      );

      expect(screen.getByTestId('content-card')).toHaveAttribute(
        'data-no-padding-x',
        'true',
      );
    });
  });
});
