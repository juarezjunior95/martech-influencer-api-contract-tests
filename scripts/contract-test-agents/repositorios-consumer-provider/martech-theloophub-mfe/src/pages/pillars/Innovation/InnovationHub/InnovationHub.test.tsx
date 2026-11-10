import React from 'react';

import { render, screen } from '@testing-library/react';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id }: { id: string }) => id),
  }),
}));

jest.mock('components', () => ({
  TabsWithFilters: ({
    filter,
    tabConfig,
    dataTestId,
    breadcrumbsList,
    isResponsivePage,
  }: {
    filter: { pageName: string; visibleFields: string[] };
    tabConfig: {
      tabs: {
        id: string;
        label: string;
        disabled?: boolean;
        content: React.ReactNode;
      }[];
      baseRoute: string;
    };
    dataTestId?: string;
    breadcrumbsList?: Array<{ href: string; pageName: string }>;
    isResponsivePage?: boolean;
  }) => (
    <div
      data-testid={dataTestId ?? filter.pageName}
      data-page-name={filter.pageName}
      data-base-route={tabConfig.baseRoute}
      data-is-responsive-page={String(!!isResponsivePage)}
    >
      <div data-testid="visible-fields">{filter.visibleFields.join(',')}</div>
      <div data-testid="breadcrumbs-list">
        {breadcrumbsList?.map((breadcrumb, index) => (
          <div
            key={breadcrumb.href}
            data-testid={`breadcrumb-${index}`}
            data-href={breadcrumb.href}
          >
            {breadcrumb.pageName}
          </div>
        ))}
      </div>
      <div data-testid="tabs-container">
        {tabConfig.tabs.map((tab) => (
          <div
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            data-label={tab.label}
            data-disabled={String(tab.disabled ?? false)}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('./tabs', () => ({
  Overview: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-overview-testid={dataTestId} data-testid="overview-content" />
  ),
}));

import { InnovationHub } from './InnovationHub';

describe('InnovationHub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with data-testid "innovation-hub"', () => {
      render(<InnovationHub />);

      expect(screen.getByTestId('innovation-hub')).toBeInTheDocument();
    });
  });

  describe('Filter configuration', () => {
    it('should pass correct pageName to filter', () => {
      render(<InnovationHub />);

      expect(screen.getByTestId('innovation-hub')).toHaveAttribute(
        'data-page-name',
        'innovation_hub',
      );
    });

    it('should pass correct visibleFields', () => {
      render(<InnovationHub />);

      expect(screen.getByTestId('visible-fields')).toHaveTextContent(
        'zone,country,periods,time_frame,kpis',
      );
    });
  });

  describe('Tabs configuration', () => {
    it('should pass correct baseRoute', () => {
      render(<InnovationHub />);

      expect(screen.getByTestId('innovation-hub')).toHaveAttribute(
        'data-base-route',
        '/innovation/innovation-performance',
      );
    });

    it('should render exactly two tabs', () => {
      render(<InnovationHub />);

      expect(screen.getAllByTestId(/^tab-/)).toHaveLength(2);
    });

    it('should render Overview tab enabled', () => {
      render(<InnovationHub />);

      const tab = screen.getByTestId('tab-overview');
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveAttribute('data-label', 'Overview');
      expect(tab).toHaveAttribute('data-disabled', 'false');
    });

    it('should render Performance & Breakdown tab enabled', () => {
      render(<InnovationHub />);

      const tab = screen.getByTestId('tab-performance-and-breakdown');
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveAttribute('data-label', 'Performance & Breakdown');
      expect(tab).toHaveAttribute('data-disabled', 'false');
    });

    it('should pass isResponsivePage to TabsWithFilters', () => {
      render(<InnovationHub />);

      expect(screen.getByTestId('innovation-hub')).toHaveAttribute(
        'data-is-responsive-page',
        'true',
      );
    });

    it('should render Overview component inside overview tab', () => {
      render(<InnovationHub />);

      expect(screen.getByTestId('overview-content')).toBeInTheDocument();
      expect(screen.getByTestId('overview-content')).toHaveAttribute(
        'data-overview-testid',
        'tabpanel-innovation-hub-overview',
      );
    });
  });

  describe('Breadcrumbs configuration', () => {
    it('should configure two breadcrumbs', () => {
      render(<InnovationHub />);

      const breadcrumbsList = screen.getByTestId('breadcrumbs-list');
      const breadcrumbs = breadcrumbsList.querySelectorAll(
        '[data-testid^="breadcrumb-"]',
      );

      expect(breadcrumbs).toHaveLength(2);
    });

    it('should configure first breadcrumb for Innovation pillar home', () => {
      render(<InnovationHub />);

      const breadcrumb = screen.getByTestId('breadcrumb-0');
      expect(breadcrumb).toHaveAttribute('data-href', '/innovation');
      expect(breadcrumb).toHaveTextContent('Pillars.pageName.innovation');
    });

    it('should configure second breadcrumb for Innovation Performance page', () => {
      render(<InnovationHub />);

      const breadcrumb = screen.getByTestId('breadcrumb-1');
      expect(breadcrumb).toHaveAttribute(
        'data-href',
        '/innovation/innovation-performance',
      );
      expect(breadcrumb).toHaveTextContent('Sidebar.innovation');
    });
  });
});
