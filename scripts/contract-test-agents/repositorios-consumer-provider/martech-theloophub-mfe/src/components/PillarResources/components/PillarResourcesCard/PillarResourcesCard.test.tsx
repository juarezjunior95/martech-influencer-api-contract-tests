import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { PlatformResource, PlatformResourceTypeOption } from '../../types';
import { PillarResourcesCard } from './PillarResourcesCard';
import type { PillarResourcesCardProps } from './types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const createResource = (
  overrides: Partial<PlatformResource> = {},
): PlatformResource => ({
  id: 1,
  name: 'Test Resource',
  summary: 'Test summary',
  mfeUrl: '/reports/test',
  pillarsIds: [1],
  typesIds: [10, 20],
  comingSoon: false,
  subPillar: null,
  options: [],
  isUserFavorite: false,
  ...overrides,
});

const mockResourceTypes: PlatformResourceTypeOption[] = [
  { id: 10, name: 'Type A', hexaColor: 'blue' },
  { id: 20, name: 'Type B', hexaColor: 'green' },
  { id: 30, name: 'Type C', hexaColor: 'red' },
];

const defaultProps: PillarResourcesCardProps = {
  resource: createResource(),
  pillar: 'Value Creation',
  icon: () => <span data-testid="pillar-icon">Icon</span>,
  platformResourceTypes: mockResourceTypes,
  onFavoriteClick: jest.fn(),
};

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent }: { icon: React.FunctionComponent }) => (
    <div data-testid="icon-component">
      <IconComponent />
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  StarFilled: () => <span data-testid="star-filled">★</span>,
  StarUnfilled: () => <span data-testid="star-unfilled">☆</span>,
}));

jest.mock('./PillarResourcesCard.styles', () => ({
  StyledCardLink: ({
    children,
    href,
    target,
    rel,
    onClick,
    download,
  }: {
    children: React.ReactNode;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: (e: React.MouseEvent) => void;
    download?: string;
  }) => (
    <a
      data-testid="card-link"
      href={href}
      target={target ?? undefined}
      rel={rel ?? undefined}
      onClick={onClick}
      download={download}
    >
      {children}
    </a>
  ),
  StyledPillarResourcesCard: ({
    children,
    disabled,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <div data-testid="pillar-resources-card" data-disabled={String(disabled)}>
      {children}
    </div>
  ),
  StyledCardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  StyledHeaderLeft: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="header-left">{children}</div>
  ),
  StyledIconContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'icon-container'}>{children}</div>,
  StyledTitleContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="title-container">{children}</div>
  ),
  StyledPillarLabel: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'pillar-label'}>{children}</div>,
  StyledToolTitle: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'tool-title'}>{children}</div>,
  StyledFavoriteButton: ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
    'aria-label'?: string;
    'data-testid'?: string;
  }) => (
    <button
      type="button"
      data-testid={testId ?? 'favorite-button'}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
  StyledCardBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-body">{children}</div>
  ),
  StyledDescription: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'description'}>{children}</div>,
  StyledCardFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-footer">{children}</div>
  ),
  StyledTagsWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tags-wrapper">{children}</div>
  ),
  TagContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <span data-testid={testId ?? 'tag'}>{children}</span>,
}));

describe('PillarResourcesCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render resource name and summary', () => {
      render(<PillarResourcesCard {...defaultProps} />);

      expect(screen.getByTestId('tool-title')).toHaveTextContent(
        'Test Resource',
      );
      expect(screen.getByTestId('description')).toHaveTextContent(
        'Test summary',
      );
    });

    it('should render pillar label when pillar is provided', () => {
      render(<PillarResourcesCard {...defaultProps} pillar="Value Creation" />);

      expect(screen.getByTestId('pillar-label')).toHaveTextContent(
        'Value Creation',
      );
    });

    it('should not render pillar label when pillar is undefined', () => {
      render(<PillarResourcesCard {...defaultProps} pillar={undefined} />);

      expect(screen.queryByTestId('pillar-label')).not.toBeInTheDocument();
    });

    it('should render tags for resource types matching typesIds', () => {
      render(<PillarResourcesCard {...defaultProps} />);

      expect(screen.getByTestId('resource-type-tag-10')).toHaveTextContent(
        'Type A',
      );
      expect(screen.getByTestId('resource-type-tag-20')).toHaveTextContent(
        'Type B',
      );
      expect(
        screen.queryByTestId('resource-type-tag-30'),
      ).not.toBeInTheDocument();
    });

    it('should render Coming Soon tag when comingSoon is true', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ comingSoon: true })}
        />,
      );

      expect(screen.getByTestId('coming-soon-tag')).toHaveTextContent(
        'Coming Soon',
      );
    });

    it('should not render Coming Soon tag when comingSoon is false', () => {
      render(<PillarResourcesCard {...defaultProps} />);

      expect(screen.queryByTestId('coming-soon-tag')).not.toBeInTheDocument();
    });

    it('should render star filled when isUserFavorite is true', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ isUserFavorite: true })}
        />,
      );

      expect(screen.getByTestId('star-filled')).toBeInTheDocument();
      expect(screen.queryByTestId('star-unfilled')).not.toBeInTheDocument();
    });

    it('should render star unfilled when isUserFavorite is false', () => {
      render(<PillarResourcesCard {...defaultProps} />);

      expect(screen.getByTestId('star-unfilled')).toBeInTheDocument();
      expect(screen.queryByTestId('star-filled')).not.toBeInTheDocument();
    });
  });

  describe('Favorite button', () => {
    it('should call onFavoriteClick with resource when favorite button is clicked', async () => {
      const onFavoriteClick = jest.fn();
      const resource = createResource();
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={resource}
          onFavoriteClick={onFavoriteClick}
        />,
      );

      await userEvent.click(screen.getByTestId('favorite-button'));

      expect(onFavoriteClick).toHaveBeenCalledTimes(1);
      expect(onFavoriteClick).toHaveBeenCalledWith(resource);
    });

    it('should not call onFavoriteClick when comingSoon is true', async () => {
      const onFavoriteClick = jest.fn();
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ comingSoon: true })}
          onFavoriteClick={onFavoriteClick}
        />,
      );

      await userEvent.click(screen.getByTestId('favorite-button'));

      expect(onFavoriteClick).not.toHaveBeenCalled();
    });

    it('should have aria-label Add to favorites when not favorite', () => {
      render(<PillarResourcesCard {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: 'Add to favorites' }),
      ).toBeInTheDocument();
    });

    it('should have aria-label Remove from favorites when favorite', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ isUserFavorite: true })}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      ).toBeInTheDocument();
    });

    it('should disable favorite button when comingSoon is true', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ comingSoon: true })}
        />,
      );

      expect(screen.getByTestId('favorite-button')).toBeDisabled();
    });
  });

  describe('Link navigation', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
    });

    it('should render an anchor wrapper for non-comingSoon resources', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ mfeUrl: '/reports/my-report' })}
        />,
      );

      expect(screen.getByTestId('card-link')).toBeInTheDocument();
    });

    it('should not render an anchor wrapper when comingSoon is true', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ comingSoon: true })}
        />,
      );

      expect(screen.queryByTestId('card-link')).not.toBeInTheDocument();
    });

    it('should strip /reports prefix from href for internal links', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ mfeUrl: '/reports/my-report' })}
        />,
      );

      expect(screen.getByTestId('card-link')).toHaveAttribute(
        'href',
        '/my-report',
      );
    });

    it('should navigate via router on internal link click', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ mfeUrl: '/value-creation/test' })}
        />,
      );

      fireEvent.click(screen.getByTestId('card-link'));

      expect(mockNavigate).toHaveBeenCalledWith('/value-creation/test');
    });

    it('should set target _blank and rel for external links', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ mfeUrl: 'https://external.com/page' })}
        />,
      );

      const link = screen.getByTestId('card-link');
      expect(link).toHaveAttribute('href', 'https://external.com/page');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not call navigate for external links', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ mfeUrl: 'https://external.com/page' })}
        />,
      );

      fireEvent.click(screen.getByTestId('card-link'));

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should set target _blank and rel when openInNewTab is true for internal links', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '/marketing-campaigns-platforms',
            openInNewTab: true,
          })}
        />,
      );

      const link = screen.getByTestId('card-link');
      expect(link).toHaveAttribute('href', '/marketing-campaigns-platforms');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not call navigate when openInNewTab is true', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '/marketing-campaigns-platforms',
            openInNewTab: true,
          })}
        />,
      );

      fireEvent.click(screen.getByTestId('card-link'));

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Download branch', () => {
    it('should render <a> with href and download attribute when downloadUrl is set', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '',
            downloadUrl: '/static/product-overview.pdf',
            downloadFileName: 'Product Overview.pdf',
          })}
        />,
      );

      const link = screen.getByTestId('card-link');
      expect(link).toHaveAttribute('href', '/static/product-overview.pdf');
      expect(link).toHaveAttribute('download', 'Product Overview.pdf');
      expect(link).not.toHaveAttribute('target');
    });

    it('should not call navigate when download link is clicked', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '',
            downloadUrl: '/static/product-overview.pdf',
          })}
        />,
      );

      fireEvent.click(screen.getByTestId('card-link'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not set target nor rel for download links (no new tab)', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '',
            downloadUrl: '/static/product-overview.pdf',
            downloadFileName: 'Product Overview.pdf',
          })}
        />,
      );

      const link = screen.getByTestId('card-link');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });

    it('should still render an empty download attribute when downloadFileName is omitted', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '',
            downloadUrl: '/static/product-overview.pdf',
          })}
        />,
      );

      const link = screen.getByTestId('card-link');
      expect(link).toHaveAttribute('download', '');
    });
  });

  describe('PDF view in new tab', () => {
    it('should open PDF in a new tab when openInNewTab is true and mfeUrl points to a PDF', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '/static/product-overview.pdf',
            openInNewTab: true,
          })}
        />,
      );

      const link = screen.getByTestId('card-link');
      expect(link).toHaveAttribute('href', '/static/product-overview.pdf');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).not.toHaveAttribute('download');
    });

    it('should not call navigate when openInNewTab is true for PDF', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({
            mfeUrl: '/static/product-overview.pdf',
            openInNewTab: true,
          })}
        />,
      );

      fireEvent.click(screen.getByTestId('card-link'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Tags with invalid hexaColor', () => {
    it('should render tag with type name when hexaColor is not in TAG_COLORS', () => {
      const typesWithInvalidColor: PlatformResourceTypeOption[] = [
        { id: 10, name: 'Custom Type', hexaColor: 'invalid-color' },
      ];
      render(
        <PillarResourcesCard
          {...defaultProps}
          resource={createResource({ typesIds: [10] })}
          platformResourceTypes={typesWithInvalidColor}
        />,
      );

      expect(screen.getByTestId('resource-type-tag-10')).toHaveTextContent(
        'Custom Type',
      );
    });
  });

  describe('Empty platformResourceTypes', () => {
    it('should render no resource type tags when platformResourceTypes is empty', () => {
      render(
        <PillarResourcesCard {...defaultProps} platformResourceTypes={[]} />,
      );

      expect(
        screen.queryByTestId('resource-type-tag-10'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('resource-type-tag-20'),
      ).not.toBeInTheDocument();
    });

    it('should default platformResourceTypes to empty array when not provided', () => {
      render(
        <PillarResourcesCard
          {...defaultProps}
          platformResourceTypes={undefined}
        />,
      );

      expect(
        screen.queryByTestId('resource-type-tag-10'),
      ).not.toBeInTheDocument();
    });
  });
});
